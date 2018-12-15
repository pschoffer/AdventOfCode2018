(ns advent.day15
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def unitPoints #{\E \G})

(defn genUnit
  [type x y id]
  {:id id
   :type type
   :p [x y]
   :a 3
   :hp 200})

(defn _parse_line
  [line y unitsCreated]
  (loop [[point & restPoints] line
         currLine []
         currUnits []
         x 0]
    (if point
      (let [isUnit? (contains? unitPoints point)
            newUnitId (+ unitsCreated (count currUnits))
            parsedPoint (if (or (= \. point) isUnit?) \.)
            newLine (conj currLine parsedPoint)
            newUnits (if isUnit? (conj currUnits (genUnit point x y newUnitId)) currUnits)]

        (recur restPoints newLine newUnits (inc x)))
      {:result currLine :units currUnits})))

(defn parseInput
  [lines]
  (loop [[line & restLines] lines
         currArea []
         currUnits []
         y 0]
    (if line
      (let [{parsedLine :result
             parsedUnits :units} (_parse_line line y (count currUnits))
            newArea (conj currArea parsedLine)
            newUnits (reduce #(conj %1 %2) currUnits parsedUnits)]
        (recur restLines newArea newUnits (inc y)))
      {:area currArea :units currUnits})))


(defn getAdjesent
  [[x y]]
  (list [x (dec y)] [(dec x) y] [(inc x) y] [x (inc y)]))

(defn isAlive?
  [unit]
  (> (:hp unit) 0))

(defn isFree?
  [[x y :as p] area units]
  (let [occupied (map :p (filter isAlive? units))]
    (and (get-in area [y x]) (not (.contains occupied p)))))

(defn isEnemy?
  [a b]
  (not (= (:type a) (:type b))))

(defn comparePosition
  [[ax ay] [bx by]]
  (let [diffY (compare ay by)]
    (if (= diffY 0)
      (compare ax bx)
      diffY)))

(defn distanceGuess
  [[ax ay] [bx by]]
  (+ (Math/abs (- by ay)) (Math/abs (- bx ax))))

(defn genA*Item
  [start p path target]
  (let [score (+ (count path) (distanceGuess p target))]
    {:start start
     :p p 
     :target target 
     :path path 
     :score score}))

(defn _a*_combine
  [sortedItems newItems]
  (loop [sorted sortedItems
         [item & rest] newItems]
    (if item 
      (let [newItemScore (:score item)
            [start end] (split-with #(<= (:score %) newItemScore) sorted)
            newSorted (doall (concat start (list item) end))]
              (recur newSorted rest))
      sorted)))

(defn _a*_combine_non_fancy
  [sortedItems newItems]
  (sort-by :score (into sortedItems newItems)))

(defn _a*_init_visited
  [area]
  (into [] (map #(into [] (repeat (count %) nil)) area)))

(defn isVisited?
  [{[x y] :p score :score} visited]
  (let [visitedValue (get-in visited [y x])]
    (if visitedValue
      (> score visitedValue)
      false)))
; (_a*_init_visited (:area test_input))
(defn a*
  [items area allUnits]
  (loop [[item & rest :as all] (sort-by :score items)
         winningItems []
         bestScore nil
         visited (_a*_init_visited area)]
    (if (and item
             (or (not bestScore) (<= (:score item) bestScore)))
      (do
        ; (binding [*out* *err*] (println "A* " all))
        (let [{p :p target :target score :score path :path start :start} item]
          (if (= p target)
            (let [newBestScore (if bestScore (min bestScore score) score)
                  ; updatedItem (assoc item :path (conj path target))
                  newWinningItems (conj winningItems item)
                  filteredRest (take-while #(<= (:score %) newBestScore) rest)]
              (recur filteredRest newWinningItems newBestScore visited))
            (let [explodedPlaces (getAdjesent p)
                  nonVisited (filter #(not (.contains path %)) explodedPlaces)
                  avaiablePlaces (filter #(or (isFree? % area allUnits) (= % target)) nonVisited)
                  newItems (map #(genA*Item start % (conj path p) target) avaiablePlaces)
                  nonVisitedNewItems (filter #(not (isVisited? % visited)) newItems)
                  filteredNewItems (if bestScore (filter #(<= (:score %) bestScore) nonVisitedNewItems) nonVisitedNewItems)
                  filteredRest (filter #(not (and (= (:start %) start) (= (:p %) p))) rest)
                  allRestItems (_a*_combine_non_fancy filteredRest filteredNewItems)
                  newVisited (assoc-in visited [(second p) (first p)] score)]
              ; (println newVisited)
              (recur allRestItems winningItems bestScore newVisited)))))
      winningItems)))


(defn findNextStep
  [items]
  (if (not (empty? items))
    (let [bestTarget (:start (first (sort-by :start comparePosition items)))
          pathsToBestTarget (map :path (filter #(= bestTarget (:start %)) items))
          steps (map last pathsToBestTarget)
          bestStep (first (sort comparePosition steps))]
      bestStep)))

(defn moveUnit
  [thisUnit area allUnits]
  (let [candidateUnits (filter #(and (isEnemy? thisUnit %) (isAlive? %)) allUnits)
        currentPosition (:p thisUnit)
        allCandidatePlaces (apply concat (map #(getAdjesent (:p %)) candidateUnits))]
    (if (some #(= currentPosition %) allCandidatePlaces)
      thisUnit
      (let [avaiablePlaces (filter #(isFree? % area allUnits) allCandidatePlaces)
            a*items (map #(genA*Item % % [] currentPosition) avaiablePlaces)
            winningItems (a* a*items area allUnits)
            nextStep (findNextStep winningItems)]
        
          ; (println thisUnit " - Candidates " candidateUnits)
          ; (println winningItems)
          (if nextStep 
            (assoc thisUnit :p nextStep)
            thisUnit)))))
; (moveUnit (first (:units test_input)) (:area test_input) (:units test_input))

(defn chooseEnemyToHit
  [enemies]
  (first (sort
          (fn [{ap :p ahp :hp} {bp :p bhp :hp}]
            (let [hpDiff (compare ahp bhp)]
              (if (= hpDiff 0) 
                (comparePosition ap bp)
                hpDiff)))
          enemies))
  )

(defn executeRound
  [area allUnits]
  (loop [[thisId & restIds] (map :id (sort-by :p comparePosition allUnits))
         currAllUnits allUnits]
    (let [thisUnit (get currAllUnits thisId)]
      (if thisUnit
        (if (isAlive? thisUnit)
          (let [enemies (filter #(and (isAlive? %) (isEnemy? % thisUnit)) currAllUnits)]
            ; (println currAllUnits)
            (if (empty? enemies)
              (let [newUnit (assoc thisUnit :win true)]
                (assoc currAllUnits (:id newUnit) newUnit))
              (let [movedUnit (moveUnit thisUnit area currAllUnits)
                    newAllUnits (assoc currAllUnits (:id movedUnit) movedUnit)
                    inRangePlaces (getAdjesent (:p movedUnit))
                    enemiesInRange (filter #(.contains inRangePlaces (:p %)) enemies)
                    preferedEnemy (chooseEnemyToHit enemiesInRange)
                    ]
                ; movedUnit
                (if preferedEnemy
                  (let [hurtEnemy (assoc preferedEnemy :hp (- (:hp preferedEnemy) (:a thisUnit)))
                        newHurtAllUnits (assoc newAllUnits (:id hurtEnemy) hurtEnemy)]
                    (do
                      (println "Moving" thisUnit (:p movedUnit))
                      (println "Atacking" preferedEnemy (:hp hurtEnemy))
                      (recur restIds newHurtAllUnits)))
                  (do
                    (println "Moving" thisUnit (:p movedUnit))
                    (recur restIds newAllUnits)))
                )))
          (recur restIds currAllUnits))
        currAllUnits))))

(defn simulateGame
  [area units]
  (loop [round 0
         currUnits units]
    (if (first (filter :win currUnits))
      {:rounds (dec round) :units currUnits}
      (let [aliveUnits (filter isAlive? currUnits)]
        (println round " - " (count aliveUnits) "(" (reduce + (map :hp aliveUnits)) ")")
        (recur (inc round) (executeRound area currUnits))))))

(defn simulateAndCount
  [area units]
  (let [{rounds :rounds endUnits :units} (simulateGame area units)
        hitpoins (reduce + (map :hp (filter isAlive? endUnits)))]
     (* rounds hitpoins)))



(def raw_input (s/split (slurp "resources/input_day15") #"\n"))
(def test_raw_input (s/split (slurp "resources/input_day15_test1") #"\n"))
(def test2_raw_input (s/split (slurp "resources/input_day15_test2") #"\n"))

(def input (parseInput raw_input))
(def test_input (parseInput test_raw_input))
(def test2_input (parseInput test2_raw_input))

; (simulateAndCount (:area test2_input) (:units test2_input))

; (moveUnit (get (:units test_input) 4) (:area test_input) (:units test_input))
