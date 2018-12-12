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


; --------------------------------- part 2 -----------------------------

(defn optimizeRules
  [rules]
  (let [onlyTrue (filter second rules)
        allPatterns (map first onlyTrue)]
    (into #{} allPatterns)))

(defn matchesRule
  [rules pattern]
  (contains? rules pattern))

(defn applyOptimizedRules
  ([state rules]
   (let [min (apply min state)
         start (- min 4)
         max (apply max state)]
     (do
      ;  (println (sort state))
       (applyOptimizedRules state rules start max #{}))))
  ([state rules position max currResult]
   (if (> position max)
     currResult
     (let [base (range position (+ position 5))
           patern (map #(contains? state %) base)
           partialResult (matchesRule rules patern)
           center (+ position 2)
           newResult (if partialResult (conj currResult center) currResult)]
       (recur state rules (inc position) max newResult)))))

(defn getPaternShift
  [a b]
  (if (= (count a) (count b))
    (let [minA (apply min a)
          minB (apply min b)
          diff (- minB minA)
          adjustedA (into #{} (map #(+ diff %) a))]
      (if (= adjustedA b) diff))))


(defn findStabilizedPatern
  ([state rules] (findStabilizedPatern state rules 0))
  ([state rules pastIterations]
   (let [nextState (applyOptimizedRules state rules)
         paternShift (getPaternShift state nextState)]
     (if paternShift
       {:shift paternShift :iteration pastIterations :patern state}
       (recur nextState rules (inc pastIterations))))))

(def opt_rules (optimizeRules rules))
(def paternInfo (findStabilizedPatern state opt_rules))

(defn applyUsingPatern
  [state rules target]
  (let [paternInfo (findStabilizedPatern state rules)
        remaining (- target (:iteration paternInfo))
        adjustment (* remaining (:shift paternInfo))]
    (into #{} (map #(+ adjustment %) (:patern paternInfo)))))


(def result_part2 (reduce + (applyUsingPatern state opt_rules 50000000000)))
