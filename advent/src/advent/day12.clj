(ns advent.day11
  (:require [clojure.string :as s]
            [clojure.set :as set]))


(def raw_input (s/split (slurp "resources/input_day12") #"\n"))
(def raw_test_input (s/split (slurp "resources/input_day12_test") #"\n"))

(defn parseState
  [stateLine]
  (let [stateSection (second (s/split stateLine #": "))
        fullState (seq stateSection)
        ids (range 0 (count fullState))]
    (into #{} (filter #(identity %) (map #(if (= %1 \#) %2 nil) fullState ids)))))

(def test_state (parseState (first raw_test_input)))
(def state (parseState (first raw_input)))


(defn parseRules
  ([rules] (parseRules rules {}))
  ([[rule & restRules] currResult]
   (if rule
     (let [[paternString resultString] (s/split rule #" => ")
           patern (map #(= \# %) paternString)
           result (= "#" resultString)
           newResult (assoc currResult patern result)]
       (recur restRules newResult))
     currResult)))

(def test_rules (parseRules (drop 2 raw_test_input)))
(def rules (parseRules (drop 2 raw_input)))


(defn applyRules
  ([state rules]
   (let [min (apply min state)
         start (- min 4)
         max (apply max state)]
     (applyRules state rules start max #{})))
  ([state rules position max currResult]
   (if (> position max)
     currResult
     (let [base (range position (+ position 5))
           patern (map #(contains? state %) base)
           partialResult (get rules patern false)
           center (+ position 2)
           newResult (if partialResult (conj currResult center) currResult)]
       (recur state rules (inc position) max newResult)))))

(def test_result ((apply comp (repeat 20 #(applyRules % test_rules))) test_state))
(def result ((apply comp (repeat 20 #((memoize applyRules) % rules))) state))

(reduce + result)
