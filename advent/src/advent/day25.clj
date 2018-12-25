(ns advent.day25
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def raw_input (s/split (slurp "resources/input_day25") #"\n"))
(def test0_raw_input (s/split (slurp "resources/input_day25_test0") #"\n"))
(def test1_raw_input (s/split (slurp "resources/input_day25_test1") #"\n"))
(def test2_raw_input (s/split (slurp "resources/input_day25_test2") #"\n"))
(def test3_raw_input (s/split (slurp "resources/input_day25_test3") #"\n"))

(defn parseInput
  [lines]
  (map #(read-string (str "[" % "]")) lines))

(def points (parseInput raw_input))
(def test0_points (parseInput test0_raw_input))
(def test1_points (parseInput test1_raw_input))
(def test2_points (parseInput test2_raw_input))
(def test3_points (parseInput test3_raw_input))

(defn getAdjecent
  [point]
  (let [adjustments '([1 0 0 0] [-1 0 0 0] [0 1 0 0] [0 -1 0 0] [0 0 1 0] [0 0 -1 0] [0 0 0 1] [0 0 0 -1])
        points (map (fn [adj] (into [] (map #(+ %1 %2) adj point))) adjustments)]
    (into #{} points)))

(defn getNeighbours
  [point targetDistance]
  (loop [generation 1
         generationItems #{point}
         neighbours #{}]
    (if (> generation targetDistance)
      neighbours
      (let [newPoints (reduce set/union (map getAdjecent generationItems))
            filteredNewPoints (set/difference newPoints neighbours #{point})
            newNeighbours (set/union neighbours filteredNewPoints)]
        (recur (inc generation) filteredNewPoints newNeighbours)))))


(defn createNewConstalations
  [point currConstalations currPointsMap]
  (let [constId (count currConstalations)
        newConstalations (conj currConstalations #{point})
        newPointsMap (assoc currPointsMap point constId)]
    [newConstalations newPointsMap]))

(defn addPointToConstalation
  [point constId currConstalations currPointsMap]
  (let [newConstalation (conj (get currConstalations constId) point)
        newConstalations (assoc currConstalations constId newConstalation)
        newPointsMap (assoc currPointsMap point constId)]
    [newConstalations newPointsMap]))

(defn mergeConstalations
  [target toBeMerged currConstalations currPointsMap]
  (let [currTarget (get currConstalations target)
        pointsToBeMoved (reduce set/union (map #(get currConstalations %) toBeMerged))
        newTarget (set/union currTarget pointsToBeMoved)
        subConstalations (assoc currConstalations target newTarget)
        newConstalations (reduce #(assoc %1 %2 #{}) subConstalations toBeMerged)
        newPointsMap (reduce #(assoc %1 %2 target) currPointsMap pointsToBeMoved)]
    [newConstalations newPointsMap]))

(defn mapConstalations
  [points]
  (let [distance 3]
    (loop [[point & restPoints] points
           constalations []
           currPointsMap {}]
      (println "Point" point constalations)
      (if point
        (let [neighbours (getNeighbours point distance)
              constalationsNear (into #{} (filter identity (map #(get currPointsMap %) neighbours)))]
          ; (println "Neigh" neighbours)
          (if (empty? constalationsNear)
            (let [[newConstalations newPointsMap] (createNewConstalations point constalations currPointsMap)]
              (recur restPoints newConstalations newPointsMap))
            (let [targetConst (first constalationsNear)
                  toBeMerged (rest constalationsNear)
                  [subConstalations subPointsMap] (addPointToConstalation point targetConst constalations currPointsMap)
                  [newConstalations newPointsMap] (mergeConstalations targetConst toBeMerged subConstalations subPointsMap)]
              ; (println constalationsNear)
              (recur restPoints newConstalations newPointsMap))))
        constalations))))


(defn countConstalations
  [points]
  (count (filter #(not (empty? %)) (mapConstalations points))))

(countConstalations test3_points)
