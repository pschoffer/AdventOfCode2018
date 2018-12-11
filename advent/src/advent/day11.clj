(ns advent.day11
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def serial 7803)
(def test_serial 18)
(def size [300 300])
(def test_size [10 10])

(defn calculateValue
  [x y serial]
  (let [realX (inc x)
        realY (inc y)
        rackId (+ realX 10)
        initialPower (* (+ (* rackId realY) serial) rackId)
        hundredDigit (quot (mod initialPower 1000) 100)
        result (- hundredDigit 5)]
    result))

(defn _generatePowerGridRow
  ([maxX serial y] (_generatePowerGridRow maxX serial y 0 []))
  ([maxX serial y x currRow]
   (if (< x maxX)
     (let [value (calculateValue x y serial)
           newRow (conj currRow value)]
       (recur maxX serial y (inc x) newRow))
     currRow)))

(defn generatePowerGrid
  ([size serial] (generatePowerGrid size serial 0 []))
  ([[maxX maxY :as size]  serial y currGrid]
   (if (< y maxY)
     (let [row (_generatePowerGridRow maxX serial y)
           newGrid (conj currGrid row)]
       (recur size serial (inc y) newGrid))
     currGrid)))

(def grid (generatePowerGrid size serial))

(def test_grid (generatePowerGrid size 18))

(defn findMatrixCoordinates
  [[startx starty] [sizex sizey]]
  (let [xrange (range startx (+ startx sizex))
        yrange (range starty (+ starty sizey))]
    (apply concat (map (fn [y] (map #(vector % y) xrange)) yrange))))

(defn filterCoordinatesBySize
  [coordinates [xsize ysize]]
  (filter #(and (< (first %) xsize) (< (second %) ysize)) coordinates))

(defn calculateValueSum
  [coordinates source]
  (reduce + (map #(get-in source [(second %) (first %)]) coordinates)))

(defn advanceCoordinate
  [[x y] [boundryx boundryy]]
  (if (< (inc x) boundryx)
    [(inc x) y]
    (if (< (inc y) boundryy)
      [0 (inc y)])))

(defn findMaxPart
  ([source sourceSize partSize] (findMaxPart source sourceSize partSize [0 0] nil nil))
  ([source sourceSize partSize coordinate currMax maxCoordinate]
   (if coordinate
     (let [matrixCoordinates (findMatrixCoordinates coordinate partSize)
           relevantCoordinates (filterCoordinatesBySize matrixCoordinates sourceSize)
           nextCoordinate (advanceCoordinate coordinate sourceSize)]
       (if (= (count matrixCoordinates) (count relevantCoordinates))
         (let [matrixValue (calculateValueSum relevantCoordinates source)
               foundNewMax? (or (not currMax) (> matrixValue currMax))
               newMax (if foundNewMax? matrixValue currMax)
               newMaxCoordinate (if foundNewMax? coordinate maxCoordinate)]
           (recur source sourceSize partSize nextCoordinate newMax newMaxCoordinate))
         (recur source sourceSize partSize nextCoordinate currMax maxCoordinate)))
     [currMax maxCoordinate])))

(def resultPart1 (findMaxPart grid size [3 3]))
