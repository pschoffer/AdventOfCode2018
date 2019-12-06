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

(def letter_map (into {} (map #(vector (str (char %1)) %2) (range (int \A) (inc (int \Z))) (range 1 100))))

(defn task_length
  ([task] (task_length task 60))
  ([task shift]
   (+ (get letter_map task) shift)))

(def workers (into [] (take 5 (map #(hash-map :free 0, :id %) (range)))))
(def test_workers (into [] (take 2 (map #(hash-map :free 0, :id %) (range)))))

(defn getBlockedSteps
  [input]
  (into #{} (map second input)))

(defn getAllSteps
  ([input] (getAllSteps input (getBlockedSteps input)))
  ([input blocked]
   (let [steps (into #{} (map first input))]
     (sort (set/union steps blocked)))))

(defn getNotBlockedSteps)

(defn _allocate_work
  [workers [freeWorker & restFreeWorkers] [freeStep & restFreeSteps] second]
  (if (or (not freeWorker) (not freeStep))
    workers
    (let
     [stepEnd (+ second (task_length freeStep))
      newWorker (assoc freeWorker :free stepEnd :last freeStep)
      newWorkers (assoc workers (:id freeWorker) newWorker)]
      ; newWorker
      (recur newWorkers restFreeWorkers restFreeSteps second))))

(defn workLength
  ([workers input] (workLength workers input 0 (into #{} (getAllSteps input))))
  ([workers input second allSteps]
   (do
    ;  (println second " - " workers)
     (let [freeWorkers (filter #(<= (:free %) second) workers)
           nextSecond (inc second)]
       (if (empty? freeWorkers)
         (recur workers input nextSecond allSteps)
         (let [finished (map #(:last %) freeWorkers)
               newInput (filter #(not (.contains finished (first %))) input)
               newAllSteps (into #{} (filter #(not (.contains finished %)) allSteps))
               blocked (getBlockedSteps newInput)
               worked_on (map #(:last %) workers)
               freeSteps (sort (filter #(and (not (contains? blocked %))
                                             (not (.contains worked_on %))) newAllSteps))]
           (if (empty? freeSteps)
             (do
              ;  (println second " - input " newInput)
               (if (= (count freeWorkers) (count workers))
                 second
                 (recur workers newInput nextSecond newAllSteps)))
             (let [newWorkers (_allocate_work workers freeWorkers freeSteps second)]
               (do

                ;  (println second " - freeWorkers " freeWorkers)
                ;  (println second " - freeSteps " freeSteps)
                ;  (println second " - workers " newWorkers)
                 (recur newWorkers newInput nextSecond newAllSteps))
                ;  finished
               ))))))))


(def test_result (workLength test_workers test_input))
(def result (workLength workers input))
