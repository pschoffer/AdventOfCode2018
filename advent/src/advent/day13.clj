(ns advent.day13
  (:require [clojure.string :as s]
            [clojure.set :as set]))


(def raw_input (s/split (slurp "resources/input_day13") #"\n"))
(def test_raw_input (s/split (slurp "resources/input_day13_test") #"\n"))
(def test2_raw_input (s/split (slurp "resources/input_day13_test2") #"\n"))
(def test3_raw_input (s/split (slurp "resources/input_day13_test3") #"\n"))

(defn getNewCarDirection
  [point]
  (let [carDirections #{\< \> \^ \v}]
    (and (contains? carDirections point) point)))

(defn _pointUnderCar
  [direction left above]
  (let [horizontal #{\< \> \- \\ \/ \+}
        vertical #{\^ \v \| \/ \\ \+}]
    (if (or (and (contains? horizontal direction) (contains? vertical above))
            (and (contains? vertical direction) (contains? horizontal left)))
      \+
      (if (contains? horizontal direction) \- \|))))

(defn _parseInputLine
  ([line currResult y] (_parseInputLine line currResult [] 0 y))
  ([[point & restLine] currResult currLine x y]
   (if point
     (let [cars (:cars currResult [])
           newCarDirection (getNewCarDirection point)]
       (if newCarDirection
         (let [newCar {:id (count cars) :direction newCarDirection :position [x y]}
               newCars (conj cars newCar)
               newResult (assoc currResult :cars newCars)
               previousLine (last (:area currResult []))
               abovePoint (get previousLine x)
               newPoint (_pointUnderCar newCarDirection (last currLine) abovePoint)
               newLine (conj currLine newPoint)]
           (recur restLine newResult newLine (inc x) y))
         (let [newPoint (if (= \space point) nil point)
               newLine (conj currLine newPoint)]
           (recur restLine currResult newLine (inc x) y))))
     (let [currArea (:area currResult [])
           newArea (conj currArea currLine)
           newResult (assoc currResult :area newArea)]
       (do
        ;  (println currResult)
        ;  (println newResult)
         newResult)))))

(defn parseInput
  ([input] (parseInput input {} 0))
  ([[line & restInput] currResult y]
   (if line
     (let [newResult (_parseInputLine line currResult y)]
       (recur restInput newResult (inc y)))
     currResult)))

(def test_input (parseInput test_raw_input))
(def input (parseInput raw_input))
(def test2_input (parseInput test2_raw_input))
(def test3_input (parseInput test3_raw_input))


(defn orderCars
  [cars]
  (sort (fn [a b]
          (let [posA (:position a)
                posB (:position b)
                diffY (compare (second posA) (second posB))
                diffX (compare (first posA) (first posB))]
            (if (= 0 diffY) diffX diffY))) cars))

(defn moveCar
  [[x y] direction]
  (case direction
    \> [(inc x) y]
    \< [(- x 1) y]
    \^ [x (- y 1)]
    \v [x (inc y)]))

(defn _intersection
  [direction intersectionCount]
  (let [; left straight right
        turnIx (mod intersectionCount 3)
        legend {\< [\v \< \^]
                \^ [\< \^ \>]
                \> [\^ \> \v]
                \v [\> \v \<]}]
    (get-in legend [direction turnIx])))

(defn updateCar
  [oldCar position track]
  (do
    ; (println oldCar position)
    (let [point (get-in track [(second position) (first position)])
          direction (:direction oldCar)
          oldIntersectionCount (:intersectionCount oldCar 0)
          newDirection (case [direction point]
                         [\> \\] \v
                         [\> \/] \^
                         [\^ \\] \<
                         [\^ \/] \>
                         [\< \\] \^
                         [\< \/] \v
                         [\v \\] \>
                         [\v \/] \<
                         (if
                          (= \+ point)
                           (_intersection direction oldIntersectionCount)
                           direction))
          newIntersectionCount (if (= \+ point) (inc oldIntersectionCount) oldIntersectionCount)]
      (do
        ; (println newDirection)
        (assoc oldCar :position position :direction newDirection :intersectionCount newIntersectionCount)))))


(defn moveCars
  ([track cars] (moveCars (orderCars cars) track cars []))
  ([[thisCar & restCars] track currCars colisions]
   (if thisCar
     (let [newPosition (moveCar (:position thisCar) (:direction thisCar))
           newCar (updateCar thisCar newPosition track)
           newCars (assoc currCars (:id newCar) newCar)
           colisionCars (filter #(= newPosition (:position %)) currCars)
           newColisions (if (empty? colisionCars) colisions (conj colisions newPosition))]
       (recur restCars track newCars newColisions))
     {:cars currCars :colisions colisions})))


(defn findFirstColision
  ([track cars] (findFirstColision track cars 0))
  ([track cars tick]
   (do
     (println tick cars)
     (let [tickResult (moveCars track cars)
           newCars (:cars tickResult)
           colisions (:colisions tickResult)]
       (if (empty? colisions)
         (recur track newCars (inc tick))
         (first colisions))))))

(def resultPart1 (findFirstColision (:area input) (:cars input)))

; ------------------------------------- Part 2 -----------------------

(defn moveCarsWithColision
  ([track cars]
   (moveCarsWithColision (orderCars (filter #(not (:crashed %)) cars)) track cars))
  ([[thisCar & restCars] track currCars]
   (if thisCar
     (let [newPosition (moveCar (:position thisCar) (:direction thisCar))
           newCar (updateCar thisCar newPosition track)
           newCars (assoc currCars (:id newCar) newCar)
           nonCrashed (filter #(not (:crashed %)) newCars)
           colisionCars (filter #(= newPosition (:position %)) nonCrashed)]
       (if (> (count colisionCars) 1)
         (let [crashedCars (reduce #(assoc %1 (:id %2) (assoc %2 :crashed newPosition)) newCars colisionCars)
               colisionCarIds (map :id colisionCars)
               newRestCars (filter #(not (.contains colisionCarIds (:id %))) restCars)]
           (recur newRestCars track crashedCars))
         (recur restCars track newCars)))
     currCars)))

(defn findLastCardStanding
  ([track cars] (findLastCardStanding track cars 0))
  ([track cars tick]
   (do
     (println tick cars)
     (let [newCars (moveCarsWithColision track cars)
           nonCrashed (filter #(not (:crashed %)) newCars)]
       (do
        ;  (println newCars)
         (if (> (count nonCrashed) 1)
           (do
             (println nonCrashed)
             (recur track newCars (inc tick)))
           nonCrashed))))))

(def result_par2 (findLastCardStanding (:area input) (:cars input)))
