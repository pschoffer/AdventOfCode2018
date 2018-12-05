(ns advent.day5
  (:require [clojure.string :as s]))
(def raw_input (slurp "resources/input_day5"))

(def input (subs raw_input 0 (- (count raw_input) 1)))
(def test_input "dabAcCaCBAcCcaDA")

(defn findReaction
  [last lastIx [first & rest]]
  (if first
    (if (and last (not (= last first)) (= (s/upper-case first) (s/upper-case last)))
      lastIx
      (recur first (inc lastIx) rest))))

(def test2 "asSsSS")

(defn react
  [input]
  (let [startIx -1
        reactionIx (findReaction nil startIx input)]
    (if reactionIx
      (let [newStr (str (subs input 0 reactionIx) (subs input (+ reactionIx 2)))]
        (recur newStr))
      input)))
(count (react test2))

