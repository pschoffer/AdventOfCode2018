(ns advent.day23
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def raw_input (s/split (slurp "resources/input_day23") #"\n"))
(def test_raw_input (s/split (slurp "resources/input_day23_test") #"\n"))
(def test2_raw_input (s/split (slurp "resources/input_day23_test2") #"\n"))


(defn parseLine
  [line]
  (let [parts (s/split line #", ")
        locRaw (second (s/split (first parts) #"=<"))
        loc (read-string (str "[" (subs locRaw 0 (dec (count locRaw))) "]"))
        radius (read-string (second (s/split (second parts) #"=")))]
    {:loc loc
     :r radius}))
(defn parseInput
  [lines]
  (loop [[line & restLines] lines
         result []]
    (if line
      (let [parsedLine (parseLine line)
            newResult (conj result parsedLine)]
        (recur restLines newResult))
      result)))

(def test_input (parseInput test_raw_input))
(def input (parseInput raw_input))
(def test2_input (parseInput test2_raw_input))

(defn findMaxRadius
  [input]
  (loop [[dron & otherDrons] input
         currentMax nil]
    (if dron
      (if (or (not currentMax) (> (:r dron) (:r currentMax)))
        (recur otherDrons dron)
        (recur otherDrons currentMax))
      currentMax)))

(defn distance
  [a b]
  (reduce + (map #(Math/abs (- %2 %1)) a b)))

(defn countWithinRadius
  [input]
  (let [{r :r maxLoc :loc} (findMaxRadius input)]
    (loop [currCount 0
           [dron & restDrons] input]
      (println dron currCount)
      (if dron
        (let [dist (distance (:loc dron) maxLoc)
              newCount (if (<= dist r) (inc currCount) currCount)]
          (recur newCount restDrons))
        currCount))))

; ---------------------- part 2----------------------

(defn furthestAway
  [input coordinate]
  (loop [[dron & restDrons] input
         furthest 0]
    (if dron
      (let [dist (distance coordinate (:loc dron))
            newFurthest (max dist furthest)]
        (recur restDrons newFurthest))
      furthest)))

(defn nextStep
  [currStep]
  (int (Math/ceil (/ currStep 2))))


(defn getSteps
  [coordinate step]
  (let [negativeStep (- step)
        adjustments [[step 0 0] [negativeStep 0 0]
                     [0 step 0] [0 negativeStep 0]
                     [0 0 step] [0 0 negativeStep]]]
    (map (fn [adjustment] (into [] (map + adjustment coordinate))) adjustments)))

(defn scoreCoordinate
  [coordinate drons]
  (loop [[dron & restDrons] drons
         currScore 0]
    (if dron
      (let [dist (distance coordinate (:loc dron))
            subScore (if (= dist 0) 1 (float (/ (:r dron) dist)))
            score (if (> subScore 1) 1 subScore)
            newScore (+ score currScore)]
        ; (println dron dist score)
        (recur restDrons newScore))
      {:loc coordinate :score currScore})))

(defn compareCandidates
  [{a_score :score a_loc :loc}
   {b_score :score b_loc :loc}]
  (let [scoreDiff (compare b_score a_score)
        origin [0 0 0]]
    (if (= scoreDiff 0)
      (compare (distance a_loc origin) (distance b_loc origin))
      scoreDiff)))

(defn awesomeAlgorithm
  [input]
  (let [initCoordinate [0 0 0]
        initStep (nextStep (furthestAway input initCoordinate))]
    (loop [coordinate initCoordinate
           step initStep]
      (let [stepCoordinates (getSteps coordinate step)
            scoredCoordinates (map #(scoreCoordinate % input) (conj stepCoordinates coordinate))
            sortedCandidates (sort compareCandidates scoredCoordinates)
            newCoordinate (:loc (first sortedCandidates))]
        (println "Step" coordinate step "score: " (:score (first sortedCandidates)))

        (if (and (= newCoordinate coordinate) (= step 1))
          (distance coordinate initCoordinate)
          (if (= newCoordinate coordinate)
            (recur coordinate (nextStep step))
            (recur newCoordinate step)))))))

; (awesomeAlgorithm test2_input)
