(ns advent.day23
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def raw_input (s/split (slurp "resources/input_day23") #"\n"))
(def test_raw_input (s/split (slurp "resources/input_day23_test") #"\n"))


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
