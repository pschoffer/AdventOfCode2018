(ns advent.day20
  (:require [clojure.string :as s]
            [clojure.set :as set]))


(def raw_input (slurp "resources/input_day20"))
(def test_raw_input "^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$")
(def test_raw_input2 "^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$")

(defn parseSequence
  [text]
  (loop [[symbol & restInput] text
         currPath []
         currPaths []]
    ; (println symbol)
    (cond (.contains #{\W \E \S \N} symbol) (recur restInput (conj currPath {:symbol symbol}) currPaths)
          (= \| symbol) (recur restInput [] (conj currPaths currPath))
          (.contains #{")" "$"} (str symbol)) {:seq (conj currPaths currPath) :restInput restInput}
          (= "(" (str symbol)) (let [{seq :seq restInputSeq :restInput} (parseSequence restInput)
                                     newCurrPath (conj currPath  {:seq seq})]
                                 (recur restInputSeq newCurrPath currPaths)))))


(def test_regexp (get (:seq (parseSequence (rest test_raw_input))) 0))
(def test_regexp2 (get (:seq (parseSequence (rest test_raw_input2))) 0))
(def regexp (get (:seq (parseSequence (rest raw_input))) 0))

(defn move
  [[y x] direction]
  (case direction
    \N [[(dec y) x] [(- y 2) x]]
    \S [[(inc y) x] [(+ y 2) x]]
    \W [[y (dec x)] [y (- x 2)]]
    \E [[y (inc x)] [y (+ x 2)]]))


(defn compareCoordinate
  [[ay ax] [by bx]]
  (let [diffY (compare ay by)]
    (if (= diffY 0)
      (compare ax bx)
      diffY)))

(defn printPath
  [path]
  (loop [current ""
         [item & restITems] path]
    (if item
      (if (:seq item)
        (str current " SEQ...")
        (recur (str current (:symbol item)) restITems))
      current)))

(defn getDoorsCoordinates
  [sequence]
  (loop [[item & restItems] sequence
         coordinate [0 0]
         doors #{}
         otherStarts []]
    ; (println "This" (printPath [item]) (count restItems) (printPath restItems) "Other" (count otherStarts))
    ; (println "Path" (printPath restItems))
    ; (println "Other" (count otherStarts) otherStarts)
    ; (println "Doors" (count doors) "\n")
    (if item
      (if (:seq item)
        (let [[firstPath & otherPaths] (:seq item)
              newOtherStarts (into otherStarts (map #(hash-map :path % :coordinate coordinate) otherPaths))
              newFirstPath (into firstPath restItems)]
          (recur newFirstPath coordinate doors newOtherStarts))
        (let [[door newLocation] (move coordinate (:symbol item))
              newDoors (conj doors door)]
          (recur restItems newLocation newDoors otherStarts)))
      (if (empty? otherStarts)
        doors
        (let [{newCoordinate :coordinate newPath :path} (first otherStarts)
              newOtherStarts (into [] (rest otherStarts))]
          (recur newPath newCoordinate doors newOtherStarts))))))


(def test_doors (getDoorsCoordinates test_regexp))
(def doors (getDoorsCoordinates regexp))

(defn getAdjecent
  [source]
  (map #(move source %) [\W \E \N \S]))

(defn furthestRoom
  [doors]
  (loop [currPositions #{[0 0]}
         doorCount 0
         currVisited #{}]
    (println doorCount currPositions)
    (if (empty? currPositions)
      doorCount
      (let [newVisited (set/union currVisited currPositions)
            candidates (apply concat (map getAdjecent currPositions))
            reachable (map second (filter #(contains? doors (first %)) candidates))
            nonVisitedReachable (into #{} (filter #(not (contains? newVisited %)) reachable))]
        (recur nonVisitedReachable (inc doorCount) newVisited)))))


;-------------------------------------- Part 2 --------------------------



(defn roomsOverX
  [doors x]
  (loop [currPositions #{[0 0]}
         doorCount 0
         currVisited #{}
         matchedDoors #{}]
    (if (empty? currPositions)
      matchedDoors
      (let [newVisited (set/union currVisited currPositions)
            candidates (apply concat (map getAdjecent currPositions))
            reachable (map second (filter #(contains? doors (first %)) candidates))
            nonVisitedReachable (into #{} (filter #(not (contains? newVisited %)) reachable))
            newMatchedDoors (if (> doorCount x) (set/union matchedDoors currPositions) matchedDoors)]
        (recur nonVisitedReachable (inc doorCount) newVisited newMatchedDoors)))))
