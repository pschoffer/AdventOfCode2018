(ns advent.day18
  (:require [clojure.string :as s]
            [clojure.set :as set]))


(def raw_input (s/split (slurp "resources/input_day18") #"\n"))
(def test_raw_input (s/split (slurp "resources/input_day18_test") #"\n"))

(defn parseLine
  [line y]
  (loop [[symbol & restSymbols] line
         x 0
         currResult {}]
    (if symbol
      (let [currCoordinates (get currResult symbol #{})
            newCoordinates (conj currCoordinates [y x])
            newResult (assoc currResult symbol newCoordinates)]
        (recur restSymbols (inc x) newResult))
      currResult)))

(defn parseInput
  [lines]
  (loop [[line & restLines] lines
         y 0
         currResult {}]
    (if line
      (let [lineResult (parseLine line y)
            newResult (reduce
                       #(let [key (first %2)
                              newSet (set/union (get %1 key #{}) (second %2))]
                          (assoc %1 key newSet))
                       currResult lineResult)]
        (recur restLines (inc y) newResult))
      currResult)))


(def area (parseInput raw_input))
(def test_area (parseInput test_raw_input))


(defn getAdjacents
  [[y x]]
  (let [adjustments (list [-1 -1] [-1 0] [-1 1]
                          [0 -1] [0 1]
                          [1 -1] [1 0] [1 1])]
    (map #(vector (+ (first %) y) (+ (second %) x)) adjustments)))


(defn addToMapsSet
  [target key value]
  (assoc target key (conj (get target key #{}) value)))

(defn transformArea
  [lastArea size]
  (loop [[y x :as coordinate] [0 0]
         currArea {}]
    (println "Procesing" coordinate)
    (if (>= y size)
      currArea
      (if (>= x size)
        (recur [(inc y) 0] currArea)
        (let [lastTrees (get lastArea \|)
              lastLumberyard (get lastArea \#)
              isTree? (contains? lastTrees coordinate)
              isLumberyard? (contains? lastLumberyard coordinate)
              isOpen? (not (or isTree? isLumberyard?))
              adjacent (getAdjacents coordinate)
              nextCoordinate [y (inc x)]
              surrowdingTrees (filter #(contains? lastTrees %) adjacent)
              surrowdingLumberyards (filter #(contains? lastLumberyard %) adjacent)]
          (cond
            isOpen? (let [toTree? (>= (count surrowdingTrees) 3)
                          newOpenArea (if toTree? (addToMapsSet currArea \| coordinate) currArea)]
                      (recur nextCoordinate newOpenArea))
            isTree? (let [toLumberyard? (>= (count surrowdingLumberyards) 3)
                          newTreeArea (if toLumberyard? (addToMapsSet currArea \# coordinate) (addToMapsSet currArea \| coordinate))]
                      (recur nextCoordinate newTreeArea))
            isLumberyard? (let [staysLumberyard? (and (not (empty? surrowdingTrees)) (not (empty? surrowdingLumberyards)))
                                newLumberyardArea (if staysLumberyard? (addToMapsSet currArea \# coordinate) currArea)]
                            (recur nextCoordinate newLumberyardArea))))))))

(defn multiTransformAndSum
  [area size transCount]

  (loop [currCount 1
         currArea area]
    (println "\nDoing" currCount "\n")
    (if (> currCount transCount)
      (* (count (get currArea \|)) (count (get currArea \#)))
      (recur (inc currCount) (transformArea currArea size)))))

; (multiTransformAndSum test_area 10 10)
