(ns advent.day1)
(require '[clojure.set :as set])

(def raw_input (slurp "resources/input_day1"))

(def adjustments (map #(Integer/parseInt %)
                      (clojure.string/split-lines raw_input)))

(reduce + adjustments)

(def test1 [+1 -1])
(def test2 [+3 +3 +4 -2 -4])
(def test3 [-6 +3 +8 +5 -6])
(def test4 [+7 +7 -2 -7 -4])

(defn frekvencies
  ([sum [head & tail]]
   (let [newSum (+ head sum)]
     (if tail
       (concat [newSum] (frekvencies newSum tail))
       [newSum])))
  ([input]
   (frekvencies 0 input)))

(defn find-first
  [f coll]
  (first (filter f coll)))

(defn findMatch
  [[head & tail] iteratedFrekvencies]
  (let [match (find-first #(= head %) iteratedFrekvencies)]
    (if match match
        (if tail
          (do
            (findMatch tail iteratedFrekvencies))))))

(defn matchingF
  [iteration maxIteration input]
  (let [baseF (frekvencies input)
        iterationAdj (last baseF)]
    (if (zero? iterationAdj)
      0
      (if (> iteration maxIteration)
        (let [iteratedFrekvencies (map #(+ % (* iteration iterationAdj)) baseF)]
          (do
            ; (print "Iteration " iteration "/" iterationAdj " - " iteratedFrekvencies "\n")
            (or (findMatch  iteratedFrekvencies baseF)
                (matchingF (inc iteration) maxIteration input))))))))

test4
(frekvencies test4)
(matchingF 1 0 adjustments)

(defn findF
  ([sum visited [head & tail] baseAdjustments]
   (if head
     (let [newF (+ sum head)]
       (if (contains? visited newF)
         newF
         (do
           (print visited)
           (findF newF (conj visited newF) tail baseAdjustments))))
     (findF sum visited baseAdjustments)))
  ([sum visited adjustments]
   (findF sum visited adjustments adjustments))
  ([sum adjustments]
   (findF sum #{sum} adjustments)))


