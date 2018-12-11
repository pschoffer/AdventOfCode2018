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

;--------------------- part 2 --------------------------

(defn optimizeY
  ([source size] (optimizeY source size [0 0] source)) 
  ([source size coordinate currOptimized]
   (if coordinate
     (let [[x y] coordinate
           nextCoordinate (advanceCoordinate coordinate size)
           lastValue (get-in currOptimized [(- y 1) x] 0)
           currValue (+ lastValue (get-in source [y x]))
           newOptimize (assoc-in currOptimized [y x] currValue)]
       (recur source size nextCoordinate newOptimize)
       )
     currOptimized))
  )


(defn _optimize2GridRow
  [row y source sourceSize optSize yoptimized]
  (let [rowCount (count source)
        rowSize (count row)
        xrange (range 0 (first sourceSize))]
    (loop [[x & restx] xrange
           currRow []]
      (if x
        (let [backYvalue (get-in yoptimized [(- y 1) x] 0)
              currYPartValue (- (get-in yoptimized [(- (+ y optSize) 1) x]) backYvalue)
              lastValue (get currRow (- (count currRow) 1) 0)
              optValue (+ currYPartValue lastValue)]

          (recur restx (conj currRow optValue)))
        currRow))))

(defn optimize2Grid
  [source sourceSize yoptimized optSize]
  (let [sourceRange (range 0 (inc (- (second sourceSize) optSize)))]
    (into [] (map #(_optimize2GridRow %1 %2 source sourceSize optSize yoptimized) source sourceRange))))


(defn advanceOptimizedCoordinate
  [[x y] [boundryx boundryy] [optx opty]]
  (if (< (+ x optx) boundryx)
    [(inc x) y]
    (if (< (+ y opty) boundryy)
      [0 (inc y)])))

(defn findMaxPartFaster
  ([source sourceSize yoptimize partSize] 
   (findMaxPartFaster 
    (optimize2Grid source sourceSize yoptimize partSize) 
    sourceSize partSize [0 0] nil nil))
  ([optSource sourceSize partSize coordinate currMax maxCoordinate]
   (if coordinate
     (let [[x y] coordinate
           backValue (get-in optSource [y (- x 1)] 0)
           endValue (get-in optSource [y (- (+ x partSize) 1)])
           nextCoordinate (advanceOptimizedCoordinate coordinate sourceSize [partSize partSize])
           matrixValue (- endValue backValue)
           foundNewMax? (or (not currMax) (> matrixValue currMax))
           newMax (if foundNewMax? matrixValue currMax)
           newMaxCoordinate (if foundNewMax? coordinate maxCoordinate)]
       (recur optSource sourceSize partSize nextCoordinate newMax newMaxCoordinate) 
     )

     [currMax maxCoordinate])))


(def resultPart1 (time (findMaxPart test_grid size [3 3])))
(def fasterResultPart1 (time (findMaxPartFaster test_grid size 300)))

(defn findVariableSize
  ([source sourceSize maxSize] 
   (findVariableSize source sourceSize
                     (optimizeY source sourceSize)
                     (range 1 (inc maxSize)) nil))
  ([source sourceSize yoptimized [partSize & restSizes] currResult]
   (if partSize
     (do
       (println partSize)
       (let [partResult (time (findMaxPartFaster source sourceSize yoptimized partSize))
             higherResult? (or (not currResult) (> (first partResult) (first currResult)))
             newResult (if higherResult? (conj partResult partSize) currResult)]
         (recur source sourceSize yoptimized restSizes newResult))
       )
     currResult
     )
     )
  )

(def resultPart2 (findVariableSize grid size 300))
