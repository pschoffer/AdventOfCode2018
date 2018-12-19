(ns advent.day19
  (:require [clojure.string :as s]
            [clojure.set :as set]
            [advent.day16 :as op]))


(def raw_input (s/split (slurp "resources/input_day19") #"\n"))
(def test_raw_input (s/split (slurp "resources/input_day19_test") #"\n"))

(def meta_ip first)

(defn parseInput
  [lines]
  (loop [[line & restLines] lines
         currMetas []
         currProgram []]
    (if line
      (let [parts (s/split line #" ")
            opStr (first parts)
            params (into [] (map #(Integer/parseInt %) (rest parts)))]
        (if (> (count params) 1)
          (let [op (eval (read-string (str "op/" opStr)))
                newInstruction {:op op :params params}
                newProgram (conj currProgram newInstruction)]
            (recur restLines currMetas newProgram))
          (let [newMeta {:op meta_ip :params params}
                newMetas (conj currMetas newMeta)]
            (recur restLines newMetas currProgram))))
      {:meta currMetas :program currProgram})))

(def test_program_info (parseInput test_raw_input))
(def program_info (parseInput raw_input))

(defn executeMeta
  [metas]
  (loop [[meta & restMetas] metas
         result nil]
    (if meta
      (recur restMetas ((:op meta) (:params meta)))
      result)))

(defn execute
  [{meta :meta
    program :program}]
  (let [ipx (executeMeta meta)]
    (loop [regs (into [] (repeat 6 0))]
      (let [ip (get regs ipx)]
        (if (and (>= ip 0) (< ip (count program)))
          (let [instruction (get program ip)
                newRegs ((:op instruction) (:params instruction) regs)
                ipUpdatedRegs (assoc newRegs ipx (inc (get newRegs ipx)))]
            (recur ipUpdatedRegs))
          regs)))))

; (execute program_info)
