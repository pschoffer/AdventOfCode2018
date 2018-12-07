(ns advent.day7
  (:require [clojure.string :as s]
            [clojure.set :as set]))
(def raw_input (s/split (slurp "resources/input_day7") #"\n"))
(def raw_test_input (s/split (slurp "resources/input_day7_test") #"\n"))

(defn parse_input
  [input]
  (let
   [regexp #"Step ([^\s]*).*step ([^\s]*)"
    groups (re-find (re-matcher regexp input))]
    (vector (get groups 1) (get groups 2))))

(def test_input (map parse_input raw_test_input))
(def input (map parse_input raw_input))

(defn findPath
  ([input] (findPath input []))
  ([input currPath]
   (let [steps (into #{} (map first input))
         blocked (into #{} (map second input))
         allSteps (sort (set/union steps blocked))
         thisStep (first (filter #(not (contains? blocked %)) allSteps))
         newInput (filter #(not (= (first %) thisStep)) input)
         newPath (conj currPath thisStep)]
     (if (empty? newInput)
       (concat newPath (sort blocked))
       (recur newInput newPath)))))

(def test_result (apply str (findPath test_input)))
(def result (apply str (findPath input)))

