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

(def result_part1 (getScoreAfter 909441 recipe elfs))
(time (getScoreAfter 2018 recipe elfs))


; ------------------------ part 2 ------------------------


(defn getNewRecipes
  [recipe elfs]
  (let [sum (reduce + (map #(get recipe %) elfs))
        generatedRecipes (_parseRecipeResult sum)]
    generatedRecipes))


(defn advancePatern
  [patern candidates input]
  (do
    ; (println input candidates)
    (let [required (map #(vector (nth patern (count %) input) %) (conj candidates []))
          advancedCandidates (map #(if (= input (first %)) (conj (second %) input)) required)]
      (into [] (filter identity advancedCandidates)))))


(defn genUntillEndsWith
  ([wantedSeq currRecipes elfs] (genUntillEndsWith wantedSeq currRecipes elfs []))
  ([wantedSeq currRecipes elfs currCandidates]
   (let [newRecipes (getNewRecipes currRecipes elfs)
         advancers (map #(fn [cands] (advancePatern wantedSeq cands %)) (reverse newRecipes))
         newCandidates ((apply comp advancers) currCandidates)
         allNewRecepies (apply conj currRecipes newRecipes)
         newElfs (moveElvs elfs allNewRecepies)
         foundIt (first (filter #(>= (count %) (count wantedSeq)) newCandidates))]
     (if foundIt
       (- (count allNewRecepies) (count foundIt))

       (do
         (println newRecipes)
         (println newCandidates)

         (recur wantedSeq allNewRecepies newElfs newCandidates))))))

(time (genUntillEndsWith (_parseRecipeResult 101) recipe elfs))
