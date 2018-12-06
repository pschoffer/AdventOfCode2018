(ns advent.day6
  (:require [clojure.string :as s]
            [clojure.set :as set]))
(def raw_input (s/split (slurp "resources/input_day6") #"\n"))
(def raw_test_input (s/split "1, 1\n1, 6\n8, 3\n3, 4\n5, 5\n8, 9" #"\n"))


(defn parseCoordinate
  [raw]
  (into [] (map #(Integer/parseInt %) (s/split raw #"[,\s]+"))))
(def input (map parseCoordinate raw_input))
(def test_input (map parseCoordinate raw_test_input))

(defn findBoundaries
  [last [currentX currentY]]
  (let [{:keys [:n :s :w :e]} last]
    (if n
      {:n (max currentY n) :s (min currentY s)
       :w (min currentX w) :e (max currentX e)}
      {:n currentY :s currentY
       :w currentX :e currentX})))

(def boundaries (reduce findBoundaries {} input))
(def test_boundaries (reduce findBoundaries {} test_input))

(defn generateEmptyArea
  [maxX maxY]
  (into [] (take (inc maxY)
                 (repeat
                  (into [] (take (inc maxX) (repeat -1)))))))

(def empty_area (generateEmptyArea (:e boundaries) (:n boundaries)))
(def empty_test_area (generateEmptyArea (:e test_boundaries) (:n test_boundaries)))

(defn plotCoordinates
  [area currentIx [coordinate & rest]]
  (if coordinate
    (let [newArea (assoc-in area [(second coordinate) (first coordinate)] currentIx)]
      (recur newArea (inc currentIx) rest))
    area))

(def test_base_area (plotCoordinates empty_test_area 0 test_input))
(def base_area (plotCoordinates empty_area 0 input))

(defn findHits
  ([area currentHits [coordinate & rest]]
   (if coordinate
     (let [hit (get-in area [(second coordinate) (first coordinate)])
           newHits (if (> hit -1) (conj currentHits hit) currentHits)]
       (recur area newHits rest))
     currentHits))
  ([area coordinates] (findHits area #{} coordinates)))

(defn getNeighborsWithinBoundaries
  [boundaries coordinate]
  (let [xadjustments [1 -1 0 0]
        yadjustments [0 0 1 -1]]
    (into #{}
          (filter
           #(let [x (first %) y (second %)]
              (and (>= x (:w boundaries))
                   (<= x (:e boundaries))
                   (>= y (:s boundaries))
                   (<= y (:n boundaries))))

           (map #(vector (+ (first coordinate) %1) (+ (second coordinate) %2)) xadjustments yadjustments)))))

(defn getDistantCoordinates
  ([targetDistance src boundaries] (getDistantCoordinates targetDistance boundaries 0 #{} #{src}))
  ([targetDistance boundaries currDistance previous toexplode]
   (if (= currDistance targetDistance)
     toexplode
     (let
      [newDistance (inc currDistance)
       newPlaces (into #{} (reduce concat (map #(getNeighborsWithinBoundaries boundaries %) toexplode)))
       ]
       (recur targetDistance boundaries newDistance toexplode (set/difference newPlaces previous toexplode))))))

; (time (map #(getDistantCoordinates % [1 1] test_boundaries) (range 1 20)))



(defn nextPoint
  [coordinate boundaries]
  (let [newX (inc (first coordinate))
        y (second coordinate)
        newY (inc y)]
    (if (> newX (:e boundaries))
      (if (> newY (:n boundaries))
        nil
        [(:w boundaries) newY])
      [newX y])))


(defn findClosest
  ([coordinate area boundaries] (findClosest coordinate area boundaries 0))
  ([coordinate area boundaries distance]
   (let
    [possible (getDistantCoordinates distance coordinate boundaries)
     closest (findHits area (seq possible))]
     (if (not (empty? closest))
       (if (> (count closest) 1)
         -1
         (first closest))
       (recur coordinate area boundaries (inc distance))))))

(defn plotAllCoordinates
  ([srcArea boundaries] (plotAllCoordinates srcArea boundaries srcArea [(:w boundaries) (:w boundaries)]))
  ([srcArea boundaries currArea coordinate]
   (if coordinate
     (do (println coordinate) (flush)
         (let [closest (findClosest coordinate srcArea boundaries)
               newArea (assoc-in currArea [(second coordinate) (first coordinate)] closest)
               newCoordinate (nextPoint coordinate boundaries)]
           (recur srcArea boundaries newArea newCoordinate)))
     currArea)))
(time (plotAllCoordinates test_base_area test_boundaries))

(def test_full_area (plotAllCoordinates test_base_area test_boundaries))
; (def full_area (plotAllCoordinates base_area boundaries))

(defn countOccurances
  [area]
  (reduce
   (fn [a b]
     (reduce (fn [result item]
               (let [key (first item)
                     curr (get result key 0)]
                 (assoc result key (+ curr (second item))))) a b))
   (map frequencies area)))

(defn getBoundaryCoord
  [boundaries]
  (let [xBound (range (:w boundaries) (inc (:e boundaries)))
        yBound (range (:s boundaries) (inc (:n boundaries)))]

    (into #{} (concat
               (map #(vector % (:s boundaries)) xBound)
               (map #(vector % (:n boundaries)) xBound)
               (map #(vector (:w boundaries) %) yBound)
               (map #(vector (:e boundaries) %) yBound)))))

(findHits test_full_area (seq (getBoundaryCoord test_boundaries)))
(def test_refined_input (into [] (map #(hash-map :point %1, :id %2) test_input (range))))
(def refined_input (into [] (map #(hash-map :point %, :id %2) input (range))))

(defn getFreeDistantItems
  [distance items boundaries area]
  (map (fn [item]
         (let [coordinate (:point item)
               allNextPoints (getDistantCoordinates distance coordinate boundaries)
               nextPoints (filter #(= -1 (get-in area [(second %) (first %)])) allNextPoints)]
           (assoc item :points nextPoints))) items))

(defn _refine_input
  [input items]
  (reduce (fn [result item]
            (let [ix (:id item)
                  countItems (count (:points item))
                  inputItem (into {} (get result ix))]
              (if (= countItems 0)
                (assoc result ix (assoc inputItem :stopped true))
                result))) input items))

(defn _refine_area
  [area items]
  (reduce (fn [result item]
            (loop [id (:id item)
                   [coordinate & rest] (:points item)
                   lastArea result]
              (if coordinate
                (let [currValue (get-in lastArea [(second coordinate) (first coordinate)])
                      newValue (if (= currValue -1) id -2)
                      newArea (assoc-in lastArea [(second coordinate) (first coordinate)] newValue)]
                  (recur id rest newArea))
                lastArea))) area items))

(defn plotAllCoordinates2
  ([input area boundaries distance]
   (let [active (filter #(not (:stopped %)) input)]
     (if (not (empty? active))
       (let [activeNewItems (getFreeDistantItems distance
                                                 active
                                                 boundaries
                                                 area)
             nextInput (_refine_input input activeNewItems)
             newArea (_refine_area area activeNewItems)]
         (recur nextInput newArea boundaries (inc distance)))
       area)))
  ([input area boundaries] (plotAllCoordinates2 input area boundaries 0)))

(def test_result_area (plotAllCoordinates2 test_refined_input empty_test_area test_boundaries))
(def result_area (plotAllCoordinates2 refined_input empty_area boundaries))

(def infinite (findHits result_area (seq (getBoundaryCoord boundaries))))
(def test_infinite (findHits test_result_area (seq (getBoundaryCoord test_boundaries))))

(def occurances (countOccurances result_area))
(def test_occurances (countOccurances test_result_area))


(def test_result (apply max
                   (map second 
                        (filter #(>= (first %) 0)
                        (filter #(not (contains? test_infinite (first %)))
                                test_occurances))
                        )))
(def result (apply max
                   (map second
                        (filter #(>= (first %) 0) 
                                (filter #(not (contains? infinite (first %))) 
                                        occurances))
                                )))