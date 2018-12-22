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
  [area [y x :as coordinate] depth target]
  (let [dependencies (getDependencies coordinate)
        geologicIx (cond (= coordinate [0 0]) 0
                         (= coordinate target) 0
                         (= y 0) (* 16807 x)
                         (= x 0) (* 48271 y)
                         :else (reduce * (map #(:erosionLevel (get-in area %)) dependencies)))
        erosionLevel (mod (+ geologicIx depth) 20183)
        type (mod erosionLevel 3)]
    {:geologixIx geologicIx
     :erosionLevel erosionLevel
     :type type}))


(defn populateArea
  ([area coordinate depth target] (populateArea area coordinate depth (list) target))
  ([area coordinate depth otherCoordinates target]
  ;  (println "current" coordinate)
  ;  (println "other" otherCoordinates)
  ;  (println "area" area)
   (if coordinate

     (if (get-in area coordinate)
       (recur area (first otherCoordinates) depth (rest otherCoordinates) target)
       (let [resizedArea (resizeToFit area coordinate)
             dependencies (getDependencies coordinate)
             nonFulfiledDep? (some not (map #(get-in resizedArea %) dependencies))]
         (if nonFulfiledDep?
           (let [newOtherCoordinates (apply conj otherCoordinates (conj dependencies coordinate))]
             (recur resizedArea nil depth newOtherCoordinates target))

           (let [value (calculateValue resizedArea coordinate depth target)
                 newArea (assoc-in resizedArea coordinate value)]
             (recur newArea nil depth otherCoordinates target)))))

     (if (empty? otherCoordinates)
       area
       (recur area (first otherCoordinates) depth (rest otherCoordinates) target)))))

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
            newArea (populateArea currArea coordinate depth target)
            value (get-in newArea coordinate)
            newSum (+ riskSum (:type value))]
        (recur newCoordinate newArea newSum)))))


; --------------------------- PArt 2 ------------------------------

;                    rocky     wet     narrow
(def allowedEntry [#{\c \t} #{\c \n} #{\n \t}])

(defn getDistance
  [[ay ax] [by bx]]
  (+ (Math/abs (- by ay)) (Math/abs (- bx ax))))

(defn getAdjecent
  [[y x]]
  (let [adjustments '([-1 0] [1 0] [0 -1] [0 1])
        candidates (map #(vector (+ (first %) y) (+ (second %) x)) adjustments)
        filteredCandidates (filter #(and (>= (first %) 0) (>= (second %) 0)) candidates)]
    filteredCandidates))

(defn canBeReached
  [area coordinate equipment]
  (let [type (:type (get-in area coordinate))
        allowedEquipment (get allowedEntry type)]
    (contains? allowedEquipment equipment)))

(defn generateA*Item
  [coordinate cost equipment target]
  (let [score (+ cost (getDistance coordinate target))]
    {:coordinate coordinate
     :equipment equipment
     :cost cost
     :score score}))

(defn explodeItem
  [currArea depth target {:keys [coordinate equipment cost]}]
  (let [adjacent (getAdjecent coordinate)
        newArea (populateArea currArea nil depth adjacent target)
        reachablePlaces (filter #(canBeReached newArea % equipment) adjacent)
        reachableItems (map #(generateA*Item % (inc cost) equipment target) reachablePlaces)
        thisTileType (:type (get-in newArea coordinate))
        changableEquipment (first (filter #(not (= % equipment)) (get allowedEntry thisTileType)))
        changebleItem (generateA*Item coordinate (+ cost 7) changableEquipment target)]
    [(conj reachableItems changebleItem) newArea]))


(defn a*
  [{target :target depth :depth}]
  (let [firstItem {:equipment \t
                   :coordinate [0 0]
                   :cost 0
                   :score (getDistance [0 0] target)}]
    (loop [items (list firstItem)
           visited {\t #{} \c #{} \n #{}}
           currArea (populateArea [] [0 0] depth target)]
      (let [sortedItems (sort-by :score items)
            {equipment :equipment coordinate :coordinate :as item} (first sortedItems)
            restItems (rest sortedItems)]
        (println "This" item "rest" (count restItems))
        (if (and (= \t equipment) (= target coordinate))
          item
          (if (contains? (get visited equipment) coordinate)
            (recur restItems visited currArea)
            (let [[explodedItems newArea] (explodeItem currArea depth target item)
                  filteredExplodedItems (filter #(not (contains? (get visited (:equipment %)) (:coordinate %))) explodedItems)
                  newRestItems (apply conj restItems filteredExplodedItems)
                  newVisited (assoc visited equipment (conj (get visited equipment) coordinate))]
              (recur newRestItems newVisited newArea))))))))

; (a* test_input)
