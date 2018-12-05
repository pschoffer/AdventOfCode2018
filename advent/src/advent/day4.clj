(ns advent.day3
  (:require [clojure.string :as str]
            [clj-time.format :as f]
            [clj-time.core :as t]))
(def raw_test_input (slurp "resources/input_test_day4"))
(def raw_input (slurp "resources/input_day4"))

(def test_input (sort (str/split raw_test_input #"\n")))
(def input (sort (str/split raw_input #"\n")))

(defn parseAction
  [action]
  (let [action-parts (str/split action #"#")]
    (if (> (count action-parts) 1)
      {:start true :id (Integer/parseInt (get (str/split (get action-parts 1) #" " 2) 0))}
      (if (re-find #"falls asleep" action)
        {:sleep true}
        {:awake true}))))

(def formatter (f/formatter "yyyy-MM-DD HH:mm"))
(def test_date (f/parse formatter "1518-09-08 00:57"))
(defn parseTime
  [time]
    (f/parse formatter time)))

(defn parseRecord
  [src]
  (let
   [parts (str/split (subs src 1) #"] " 2)
    time (get parts 0)
    action (get parts 1)]
    (into {:time (parseTime time)} (parseAction action))))

(def test_records (map parseRecord test_input))
(def records (map parseRecord input))

(defn groupRecords
  [records groups]
  (if (> (count records) 0)
    (let [first (first records)
          split (split-with (partial (fn [record] (not (:start record)))) (rest records))
          first-rest (nth split 0)]
      (recur (nth split 1) (into groups [(into [first] first-rest)])))
    groups))

(defn mapInterval
  [from_raw to_raw]
  {:from  (:time from_raw)
   :to (:time to_raw)})

(defn refineGroup
  [[first & times]]
  {:id (:id first)
   :intervals (map mapInterval (take-nth 2 times) (take-nth 2 (rest times)))})

(defn groupRefined
  [target record]
  (let [id (:id record)
        intervals (:intervals record)
        current (get target id)]
    (if current
      (assoc target id (concat current intervals))
      (assoc target id intervals))))
(def reduced_test_records (reduce groupRefined {} (map refineGroup (groupRecords test_records []))))
(def reduced_records (reduce groupRefined {} (map refineGroup (groupRecords records []))))

(defn is-earlier
  [from to]
  (let
   [datecompare (compare (:date from) (:date to))]
    (or (< datecompare 0)
        (and (= datecompare 0) (< (:hour from) (:hour to)))
        (and (= datecompare 0) (= (:hour from) (:hour to)) (< (:min from) (:min to))))))

(defn incDate
  [date]
  )

(defn incTime
  [{:keys [hour min date]} time]
  (if (< min 59)
    {:hour hour :min (inc min) :date date}
    (if (< hour 23) 
      {:hour (inc hour) :min 0 :date date}
      {:hour 0 :min 0 :date (incDate date)})))

(t/before? test_date test_date )
(defn appendInterval
  [current interval]
  (let [hour (t/hour (:from interval))
        min (t/minute (:from interval))
        currentCount (get-in current [hour min] 0)]
    (if (t/before? (:from interval) (:to interval))
      (let [next_from (t/plus (:from interval) (t/minutes 1))
            newCurrent (assoc-in current [hour min] (inc currentCount))]
           (recur newCurrent {:from next_from :to (:to interval)})
           )
      current)))

(defn composeMapIntervals
  [intervals]
  (reduce appendInterval {} intervals))

(defn countSleep
  [sleepMap]
  (reduce +
          (map (fn [hour]
                 (reduce +
                         (map #(get % 1)
                              (seq (get hour 1))))) sleepMap)))

(defn findLongestSleeper
  [last [id intervals]]
  (let [lastCount (:count last 0)
        sleepMap (composeMapIntervals intervals)
        thisCount (countSleep sleepMap)]
       (if (> thisCount lastCount)
         {:count thisCount :sleepMap sleepMap :id id :intervals intervals}
         last)
       )
  )

(defn findLongestSleeperPerMinute
  [last [id intervals]]
  (let [lastCount (:count last 0)
        sleepMap (composeMapIntervals intervals)
        longestMinutesPerHour (map findLongestMinute sleepMap)
        longestMinute (reduce #(if (> (:count %2) (:count %1)) %2 %1) longestMinutesPerHour)
        currentCount (:count longestMinute)
        ]
    (if (> currentCount lastCount)
      {:count currentCount :longestMinute (:min longestMinute) :id id }
      last)))




(def longest_test (reduce findLongestSleeper {} reduced_test_records))
(def longest (reduce findLongestSleeper {} reduced_records))

(map #(count (get % 1)) (filter #(> (count (get % 1)) 0) reduced_records))
(def longest_minute_result (reduce findLongestSleeperPerMinute {} (filter #(> (count (get % 1)) 0) reduced_records)))
(reduce findLongestSleeperPerMinute {} reduced_test_records)

(* (:id longest_minute_result) (:longestMinute longest_minute_result))

(defn findLongestMinute
  [[hour minutes]]
  (reduce (fn 
            [last [min count]]
            (if (> count (:count last 0))
              {:min min :count count}
              last))
          {}
          minutes)
  )


(map #(get % 1) (:sleepMap longest_test))

(def minute (:min (nth (map findLongestMinute (:sleepMap longest)) 0)))
(* (:id longest) minute)


