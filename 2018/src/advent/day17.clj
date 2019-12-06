(ns advent.day17
  (:require [clojure.string :as s]
            [clojure.set :as set]))


(def raw_input (s/split (slurp "resources/input_day17") #"\n"))
(def test_raw_input (s/split (slurp "resources/input_day17_test") #"\n"))


(defn parseCoordinatesFromRecord
  [record]
  (let [[fixedPart rangePart] (s/split record #", ")
        [fixedCoordinate fixedValueStr] (s/split fixedPart #"=")
        fixedValue (Integer/parseInt fixedValueStr)
        [rangeStart rangeEnd] (map #(Integer/parseInt %) (s/split (get (s/split rangePart #"=") 1) #"\.+"))
        rangeValues (range rangeStart (inc rangeEnd))]
    (if (= fixedCoordinate "x")
      (into #{} (map #(vector % fixedValue) rangeValues))
      (into #{} (map #(vector fixedValue %) rangeValues)))))

(defn parseCoordinates
  [lines]
  (loop [[line & rest] lines
         currCoordinates #{}]
    (if line
      (let [coordinatesFromThisLine (parseCoordinatesFromRecord line)
            newCoordinates (into currCoordinates coordinatesFromThisLine)]
        (recur rest newCoordinates))
      currCoordinates)))

(def ore (parseCoordinates raw_input))
(def test_ore (parseCoordinates test_raw_input))

(defn boundaries
  [coordinates]
  {:top (apply min (map first coordinates)) :bottom (apply max (map first coordinates))
   :left (apply min (map second coordinates)) :right (apply max (map second coordinates))})

(defn findOverflow
  [startCoordinate floor xadj]
  (loop [[y x :as coordinate] startCoordinate
         contained #{}]
    (if (contains? floor coordinate)
      {:contained contained :end coordinate}
      (let [below [(inc y) x]]
        (if (contains? floor below)
          (recur [y (xadj x)] (conj contained coordinate))
          {:contained contained :overflow coordinate})))))

(defn flowWater
  [ore startCoordinate]
  (let [{bottom :bottom} (boundaries ore)]
    (loop [coordinate startCoordinate
           flowWater #{}
           settledWater #{}
           otherSources []
           checked #{}]
      (println "Checking" coordinate otherSources)
      (if (or (not coordinate) (> (first coordinate) bottom) (contains? settledWater coordinate))
        (if (empty? otherSources)
          {:flow flowWater :settled settledWater}
          (let [newSource  (first otherSources)
                newChecked (conj checked newSource)
                newOtherSources (into [] (rest otherSources))]
            (recur newSource flowWater settledWater newOtherSources newChecked)))
        (let [[y x] coordinate
              below [(inc (first coordinate)) x]
              floor (set/union ore settledWater)]
          (if (contains? floor below)
            (let [{leftContained :contained leftOverflow :overflow} (findOverflow [y (dec x)] floor dec)
                  {rightContained :contained rightOverflow :overflow} (findOverflow [y (inc x)] floor inc)
                  allContained (set/union leftContained rightContained #{coordinate})]
              ; (println leftOverflow rightOverflow allContained)
              (if (or leftOverflow rightOverflow)
                (let [newFlow (set/union flowWater allContained)
                      overflowSources (filter #(and % (not (contains? checked %)) (not (.contains otherSources %))) [leftOverflow rightOverflow])
                      newSources (reduce conj otherSources overflowSources)]
                  ; (println "Overflow: "  (sort-by second allContained) "Adding" overflowSources)

                  (recur nil newFlow settledWater newSources checked))
                (let [newFlow (set/difference flowWater allContained)
                      newSettled (set/union settledWater allContained)
                      newCoordinate [(dec y) x]]
                  ; (println "Not overflow: "  (sort-by second allContained))
                  (recur newCoordinate newFlow newSettled otherSources checked))))
            (let [newFlow (conj flowWater coordinate)]
              (recur below newFlow settledWater otherSources checked))))))))

(defn flowAndCount
  [ore]
  (let [{top :top} (boundaries ore)
        {flow :flow settled :settled} (flowWater ore [top 500])]
    (println (count flow) (count settled))
    (println "Flow" flow)
    (println "Settle" settled)
    ; (println "Both" (set/intersection flow settled))
    (count settled)))

(defn printOre
  [ore]
  (let [{ystart :top ymax :bottom xstart :left xmax :right}  (boundaries ore)]
    (println xstart)
    (loop [y ystart x xstart]
      (if (<= y ymax)
        (if (<= x xmax)
          (let [symbol (if (contains? ore [y x]) \# \space)]
            (print symbol)
            (recur y (inc x)))
          (do
            (print "\n")
            (recur (inc y) xstart)))))))

