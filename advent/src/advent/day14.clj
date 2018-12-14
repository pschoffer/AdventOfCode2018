(ns advent.day13
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def recipe [3 7])
(def elfs [0 1])

(defn _parseRecipeResult
  [input]
  (if (= input 0)
    (list 0)

    (loop [result (list)
           n input]
      (if (> n 0)
        (let [digit (mod n 10)
              newResult (conj result digit)
              newN (quot n 10)]
          (recur newResult newN))
        result))))

(defn generateRecipes
  [recipe elfs]
  (let [sum (reduce + (map #(get recipe %) elfs))
        generatedRecipes (_parseRecipeResult sum)
        newRecipe (reduce #(conj %1 %2) recipe generatedRecipes)]
    newRecipe))

(defn moveElvs
  [elfs recipes]
  (let [ixBorder (count recipes)
        newElfs (map (fn [origin] (let [shift (inc (get recipes origin))
                                        newPosition (mod (+ origin shift) ixBorder)]
                                    newPosition)) elfs)]
    (do
      (into [] newElfs))))



(defn genUntill
  [wantedCount currRecipes elfs]
  (do
    ; (println (drop  (- (count currRecipes) 15)  currRecipes))
    ; (println elfs)

    (let [currCount (count currRecipes)]
      (if (< currCount wantedCount)
        (let [newRecipes (generateRecipes currRecipes elfs)
              newElfs (moveElvs elfs newRecipes)]
          ; newRecipes)
          (recur wantedCount newRecipes newElfs))
        currRecipes))))

(defn getScoreAfter
  [n recipes elfs]
  (let [resultRecipes (genUntill (+ n 10) recipes elfs)
        scoreValues (take 10 (drop n resultRecipes))]
    (apply str scoreValues)))

(time (def result_part1 (getScoreAfter 909441 recipe elfs)))
(time (getScoreAfter 2018 recipe elfs))


; ------------------------ part 2 ------------------------

(defn endsWithReverse
  ([source reversePatern toCheck]
   (loop [iter 0
          sourceLength (count source)]
     (if (< iter toCheck)
       (if (endsWithReverse source reversePatern (- sourceLength iter 1) toCheck)
         iter
         (recur (inc iter) sourceLength)))))
  ([source [item & restItems] sourceIx toCheck]
   (if item
     (if (= item (get source sourceIx))
       (recur source restItems (- sourceIx 1) toCheck)
       false)
     true)))

(defn getNewRecipes
  [recipe elfs]
  (let [sum (reduce + (map #(get recipe %) elfs))
        generatedRecipes (_parseRecipeResult sum)]
    generatedRecipes))

(defn genUntillEndsWith
  ([wantedSeq currRecipes elfs] (genUntillEndsWith wantedSeq currRecipes elfs (reverse wantedSeq)))
  ([wantedSeq currRecipes elfs reversedPatern]
   (let [newItems (getNewRecipes currRecipes elfs)
         newRecipes (reduce #(conj %1 %2) currRecipes newItems)
         newElfs (moveElvs elfs newRecipes)]
     (let [afterPatern (endsWithReverse newRecipes reversedPatern 2)]
       (if afterPatern
         (- (count newRecipes) afterPatern (count reversedPatern))
         (recur wantedSeq newRecipes newElfs reversedPatern))))))

(time (genUntillEndsWith (_parseRecipeResult 101) recipe elfs))

