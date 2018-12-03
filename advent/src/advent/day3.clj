(ns advent.day3
  (:require [clojure.string :as str]))
(def raw_input (slurp "resources/input_day3"))
(def test_input "#1 @ 1,3: 4x4\n#2 @ 3,1: 4x4\n#3 @ 5,5: 2x2")

(defn parseRecord
  [record]
  (let [parts (str/split record #" ")]
    {:id  (Integer/parseInt (subs (first parts) 1))
    ;  :source parts
     :start (let
             [src (get parts 2)
              coordinates (map #(Integer/parseInt %) (str/split
                                                      (subs src 0 (str/index-of src ":"))
                                                      #","))]
              {:x (first coordinates) :y (second coordinates)})
     :diff (let
            [src (get parts 3)
             coordinates (map #(Integer/parseInt %) (str/split src #"x"))]
             {:x (first coordinates) :y (second coordinates)})}))

(def records
  (map #(parseRecord %) (str/split-lines raw_input)))
(def test_records
  (map #(parseRecord %) (str/split-lines test_input)))
test_records

(defn maxCoordinate
  [records]
  {:x (apply max (map #(- (+ (get-in % [:start :x]) (get-in % [:diff :x])) 1) records))
   :y (apply max (map #(- (+ (get-in % [:start :y]) (get-in % [:diff :y])) 1) records))})
; (maxCoordinate records) 

(defn getMap
  [size]
  (into [] (repeat size (into [] (repeat size '())))))
(get-in (getMap 500) [1])

(defn addCoordinate
  [area x y id]
  (assoc-in area [x y] (conj (get-in area [x y]) id)))

(defn addItem
  [area data]
  (let [x (get-in data [:start :x])
        y (get-in data [:start :y])
        endx (+ x (get-in data [:diff :x]))
        endy (+ y (get-in data [:diff :y]))]
    (loop [currarea area currx x curry y]
      (if (< curry endy)
        (if (< currx endx)
          (recur (addCoordinate currarea currx curry (get data :id)) (inc currx) curry)
          (recur currarea x (inc curry)))
        currarea))))

(def populatedArea (reduce
                    addItem
                    (getMap 1000)
                    records))

(defn countLine
  [line]
  (count (filter #(> % 1) (map #(count %) line))))

(reduce + (map #(countLine  %) populatedArea))
