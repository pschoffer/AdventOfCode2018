(ns advent.day2)
(def raw_input (slurp "resources/input_day2"))

(def ids (clojure.string/split-lines raw_input))

(def test ["abcdef", "bababc", "abbcde", "abcccd", "aabcdd", "abcdee", "ababab"])
(def test2 ["abcde" "fghij" "klmno" "pqrst" "fguij" "axcye" "wvxyz"])

(defn findRepeat
  [input count]
  (let [letters (frequencies input)
        result []]
    (map
     #(first %)
     (filter #(= count (second %)) letters))))

(defn findRepeatVector
  [[head & tail] matches]
  (let [headRepeats (findRepeat head matches)]
    (if tail
      (concat [headRepeats] (findRepeatVector tail matches))
      [headRepeats])))

(defn countNotEmpty
  [col]
  (count
   (filter #(not (empty? %)) col)))

(*
 (countNotEmpty (findRepeatVector ids 2))
 (countNotEmpty (findRepeatVector ids 3)))


(defn diff
  [a b]
  (let [aFirst (first a)
        bFirst (first b)]

    (if (nil? aFirst) [[] [] []]
        (let [tailDiff (diff (rest a) (rest b))]
          (map #(concat %1 %2) (if
                                (= aFirst bFirst) [[] [] [aFirst]]
                                [[aFirst] [bFirst] []])
               tailDiff)))))

(defn findSimilar
  [[head & tail]]
  (let [diffs (map #(diff head %) tail)
        result (first (filter #(< (count (first %)) 2) diffs))]
    (do
      (print diffs "\n")
      (if result result
          (findSimilar tail)))))

test

test2
(findSimilar test2)

(reduce str (nth (findSimilar ids) 2))
