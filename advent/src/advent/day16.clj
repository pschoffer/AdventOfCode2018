(ns advent.day16
  (:require [clojure.string :as s]
            [clojure.set :as set]))


(defn _parseBeforeAfter
  [text]
  (read-string (second (s/split text #": "))))

(defn parseSample
  [text]
  (let [[beforeText opText AfterText] (s/split text #"\n")
        before (_parseBeforeAfter beforeText)
        after (_parseBeforeAfter AfterText)
        op (read-string (str "[" opText "]"))]
    {:before before :op op :after after}))

(defn parseInput
  [text]
  (let [[samples test] (s/split text #"\n\n\n")
        sampleLines (s/split samples #"\n\n")
        samples (map parseSample sampleLines)]
; (println parts)
    {:samples samples}))



(defn addr
  [[A B C] registers]
  (assoc registers C (+ (get registers A) (get registers B))))

;     addi (add immediate) stores into register C the result of adding register A and value B.
(defn addi
  [[A B C] registers]
  (assoc registers C (+ (get registers A) B)))



; Multiplication:

;     mulr (multiply register) stores into register C the result of multiplying register A and register B.
(defn mulr
  [[A B C] registers]
  (assoc registers C (* (get registers A) (get registers B))))

;     muli (multiply immediate) stores into register C the result of multiplying register A and value B.
(defn muli
  [[A B C] registers]
  (assoc registers C (* (get registers A) B)))

; Bitwise AND:

;     banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
(defn banr
  [[A B C] registers]
  (assoc registers C (bit-and (get registers A) (get registers B))))

;     bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
(defn bani
  [[A B C] registers]
  (assoc registers C (bit-and (get registers A) B)))

; Bitwise OR:

;     borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
(defn borr
  [[A B C] registers]
  (assoc registers C (bit-or (get registers A) (get registers B))))

;     bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
(defn bori
  [[A B C] registers]
  (assoc registers C (bit-or (get registers A) B)))

; Assignment:

;     setr (set register) copies the contents of register A into register C. (Input B is ignored.)
(defn setr
  [[A B C] registers]
  (assoc registers C (get registers A)))

;     seti (set immediate) stores value A into register C. (Input B is ignored.)
(defn seti
  [[A B C] registers]
  (assoc registers C A))

; Greater-than testing:

;     gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
(defn gtir
  [[A B C] registers]
  (assoc registers C (if (> A (get registers B)) 1 0)))

;     gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
(defn gtri
  [[A B C] registers]
  (assoc registers C (if (> (get registers A) B) 1 0)))

;     gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
(defn gtrr
  [[A B C] registers]
  (assoc registers C (if (> (get registers A) (get registers B)) 1 0)))

; Equality testing:

;     eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
(defn eqir
  [[A B C] registers]
  (assoc registers C (if (= A (get registers B)) 1 0)))

;     eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
(defn eqri
  [[A B C] registers]
  (assoc registers C (if (= (get registers A) B) 1 0)))

;     eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
(defn eqrr
  [[A B C] registers]
  (assoc registers C (if (= (get registers A) (get registers B)) 1 0)))

(def test_input (parseInput (slurp "resources/input_day16_test")))
(def input (parseInput (slurp "resources/input_day16")))

(def allOps [addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr])

(defn isApplicable?
  [{before :before opRecepi :op after :after} op]
  (let [result (op (rest opRecepi) before)]
    (= after result)))

(defn getApplicable
  [sample]
  (let [apllicable (filter #(isApplicable? sample %) allOps)]
    (map str apllicable)))

(def test_sampe {:before [3, 2, 1, 1] :op [9 2 1 2] :after [3, 2, 2, 1]})

(defn countMultiApplications
  [samples]
  (loop [[sample & rest] samples
         currCount 0]
    (if sample
      (let [applicables (getApplicable sample)
            multi? (> (count applicables) 2)
            newCount (if multi? (inc currCount) currCount)]
        (recur rest newCount))
      currCount)))

(countMultiApplications (:samples input))
