(ns advent.day10
  (:require [clojure.string :as s]
            [clojure.set :as set]))


(def raw_input (s/split (slurp "resources/input_day10") #"\n"))
(def raw_test_input (s/split (slurp "resources/input_day10_test") #"\n"))

(defn parseCoordinates
  [text]
  (let [parts (s/split text #",")]
    (into [] (map #(Integer/parseInt  (s/trim %)) parts))))

(defn parseRecord
  [text]
  (let [regexp #"[^<]*<([0-9\s,-]+)[^<]*<([0-9\s,-]+)"
        groups (re-find (re-matcher regexp text))
        position (parseCoordinates (get groups 1))
        velocity (parseCoordinates (get groups 2))]
    {:p position :v velocity}))

(def test_input (map parseRecord raw_test_input))
(def input (map parseRecord raw_input))


(defn extremes
  [coordinates]
  (let [allx (map first coordinates)
        allY (map second coordinates)]
    {:maxX (apply max allx)
     :minX (apply min allx)
     :maxY (apply max allY)
     :minY (apply min allY)}))

(defn diffExtremes
  [coordinates]
  (let [extremes (extremes coordinates)]
    ; (+ 
    (- (:maxX extremes) (:minX extremes))
    ;  (- (:maxY extremes) (:minY extremes))
    ;  )
    ))

(defn addCoordinates
  [a b]
  [(+ (first a) (first b)) (+ (second a) (second b))])

(defn advaceInput
  [input]
  (map #(let [{:keys [p v]} %
              newP (addCoordinates p v)]
          {:p newP :v v}) input))


(defn findText
  ([input] (findText input nil))
  ([input lastDistance]
   (do
     (println "Distance " lastDistance)
     (let [advacedInput (advaceInput input)
           newDistance (diffExtremes (map :p advacedInput))]
       (if (or (not lastDistance) (< newDistance lastDistance))
         (recur advacedInput newDistance)
         input)))))
(def test_text (findText test_input))
(def text (findText input))


(defn getRowText
  ([ixs startX] (getRowText ixs startX ""))
  ([[first & rest] currentIx current]
   (if first
     (let [spaceCount (- first currentIx)
           spaces (apply str (take spaceCount (repeat \.)))
           newText (str current spaces "#")
           newIx (+ currentIx spaceCount 1)]
       (recur rest newIx newText))
     current)))



(defn getText
  [coordinates]
  (let [startX (:minX (extremes coordinates))
        row_groups (group-by second coordinates)
        row_coordinates (map second (sort row_groups))
        rows (map #(sort (into #{} (map first %))) row_coordinates)]
    (map #(getRowText % startX) rows)))

(defn printLines
  [lines]
  (do
    (println "TEXT:")
    (map #(print % "\n") lines)))

(printLines (getText (map :p test_text)))
(printLines (getText (map :p text)))

; ------------------------------------- part 2 -------------------------------------

(defn findTextTime
  ([input] (findTextTime input nil 0))
  ([input lastDistance time]
   (do
     (println "Distance " lastDistance)
     (let [advacedInput (advaceInput input)
           newDistance (diffExtremes (map :p advacedInput))]
       (if (or (not lastDistance) (< newDistance lastDistance))
         (recur advacedInput newDistance (inc time))
         time)))))

; (findTextTime input)
