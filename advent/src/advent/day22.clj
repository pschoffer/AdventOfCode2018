(ns advent.day22
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def input {:depth 8112 :target [743 13]})
(def test_input {:depth 510 :target [10 10]})

(defn resizeToFit
  [area [y x]]
  (let [missingY (- y (dec (count area)))
        areaWithEnoughRows (apply conj area (repeat missingY []))
        row (get areaWithEnoughRows y)
        missingX (- x (dec (count row)))
        resizedRow (apply conj row (repeat missingX nil))]
    (assoc areaWithEnoughRows y resizedRow)))

(defn getDependencies
  [[y x]]
  (if (or (= y 0) (= x 0))
    (list)
    (list [(dec y) x] [y (dec x)])))

(defn calculateValue
  [area [y x :as coordinate] depth]
  (let [dependencies (getDependencies coordinate)
        geologicIx (cond (= coordinate [0 0]) 0
                         (= y 0) (* 16807 x)
                         (= x 0) (* 48271 y)
                         :else (reduce * (map #(:erosionLevel (get-in area %)) dependencies)))
        erosionLevel (mod (+ geologicIx depth) 20183)
        type (mod erosionLevel 3)]
    {:geologixIx geologicIx
     :erosionLevel erosionLevel
     :type type}))


(defn populateArea
  ([area coordinate depth] (populateArea area coordinate depth (list)))
  ([area coordinate depth otherCoordinates]
  ;  (println "current" coordinate)
  ;  (println "other" otherCoordinates)
  ;  (println "area" area)
   (if coordinate

     (if (get-in area coordinate)
       (recur area (first otherCoordinates) depth (rest otherCoordinates))
       (let [resizedArea (resizeToFit area coordinate)
             dependencies (getDependencies coordinate)
             nonFulfiledDep? (some not (map #(get-in resizedArea %) dependencies))]
         (if nonFulfiledDep?
           (let [newOtherCoordinates (apply conj otherCoordinates (conj dependencies coordinate))]
             (recur resizedArea nil depth newOtherCoordinates))

           (let [value (calculateValue resizedArea coordinate depth)
                 newArea (assoc-in resizedArea coordinate value)]
             (recur newArea nil depth otherCoordinates)))))

     (if (empty? otherCoordinates)
       area
       (recur area (first otherCoordinates) depth (rest otherCoordinates))))))

(defn moveCoordinateUntill
  [[y x] [topY topX]]
  (if (= x topX)
    [(inc y) 0]
    [y (inc x)]))

(defn countRiskLevel
  [{target :target depth :depth}]
  (loop [coordinate [0 0]
         currArea []
         riskSum 0]
    (println coordinate riskSum)
    ; (println currArea "\n")
    (if (= coordinate target)
      riskSum
      (let [newCoordinate (moveCoordinateUntill coordinate target)
            newArea (populateArea currArea coordinate depth)
            value (get-in newArea coordinate)
            newSum (+ riskSum (:type value))]
        (recur newCoordinate newArea newSum)))))

; (countRiskLevel test_input)
