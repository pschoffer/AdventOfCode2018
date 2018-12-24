(ns advent.day24
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def raw_input (slurp "resources/input_day24"))
(def test_raw_input (slurp "resources/input_day24_test"))

(defn _parseAdjustment
  [line]
  (let [key (if (re-matches #".*immune.*" line) :imune :weak)
        item_source (get (s/split line #" to ") 1)
        items (into #{} (s/split item_source #", "))]
    {key items}))

(defn parseAdjustments
  [text]
  (let [adjustmentsSource (re-matches #".*\((.*)\).*" text)
        init {:imune #{} :weak #{}}]
    (if adjustmentsSource
      (let [sources (s/split (get adjustmentsSource 1) #";")]
        (reduce #(into %1 (_parseAdjustment %2)) init sources))
      init)))

(defn parseArmy
  [text type startArmy]
  (let [lines (s/split text #"\n")]
    (loop [[line & restLines] (rest lines)
           currResult startArmy]
      (if line
        (let [results (re-matches #"(\d+)[^\d]*(\d+)[^\d]*(\d+)\s*(\w+)[^\d]*(\d+).*" line)
              adjustments (parseAdjustments line)
              unit {:id (count currResult)
                    :size (read-string (get results 1))
                    :type type
                    :hp (read-string (get results 2))
                    :attack (read-string (get results 3))
                    :attack_type (get results 4)
                    :initiative (read-string (get results 5))}
              unit_with_adjustmenst (into unit adjustments)
              newResult (conj currResult unit_with_adjustmenst)]
          (recur restLines newResult))
        currResult))))

(defn parseInput
  [text]
  (let [armyTexts (s/split text #"\n\n")
        immuneArmy (parseArmy (first armyTexts) "Immune" [])
        allArmy (parseArmy (second armyTexts) "Inf" immuneArmy)]
    allArmy))

(def units (parseInput raw_input))
(def test_units (parseInput test_raw_input))

(defn effectiveAttack
  [unit]
  (* (:size unit) (:attack unit)))

(defn isAlive?
  [unit]
  (> (:size unit) 0))

(defn _target_order_compare
  [a b]
  (let [eff_diff (compare (effectiveAttack b) (effectiveAttack a))]
    (if (= 0 eff_diff)
      (compare (:initiative b) (:initiative a))
      eff_diff)))

(defn _target_order
  [units]
  (map :id (sort _target_order_compare units)))

(defn _get_effectivnes
  [unit attackType]
  (cond (contains? (:weak unit) attackType) :weak
        (contains? (:imune unit) attackType) :imune
        :else :normal))


(defn partitionByEffectivness
  [units attackType]
  (let [groups (group-by #(_get_effectivnes % attackType) units)]
    (into {} (map #(vector (first %) (sort _target_order_compare (second %))) groups))))

(defn target
  [units]
  (let [initTargets (into [] (repeat (count units) nil))
        targetOrder (_target_order units)]
    ; (println "Target Order" targetOrder)
    (loop [[attacker & others] targetOrder
           currTargets initTargets]
      (if attacker
        (let [thisUnit (get units attacker)
              attackType (:attack_type thisUnit)
              enemies (filter #(not (= (:type %) (:type thisUnit))) units)
              possibleTargets (filter #(and (isAlive? %) (not (.contains currTargets (:id %)))) enemies)
              possibleTargetsGroups (partitionByEffectivness possibleTargets attackType)
              target (first (concat (:weak possibleTargetsGroups) (:normal possibleTargetsGroups)))
              newTargets (assoc currTargets attacker (:id target))]
          (recur others newTargets))
        currTargets))))

(defn atack_order
  [units]
  (let [aliveUnits (filter isAlive? units)
        orderedUnits (sort-by :initiative #(compare %2 %1) aliveUnits)]
    (map :id orderedUnits)))

(defn hurtUnit
  [attacker target]
  (let [attackType (:attack_type attacker)]
    (if (contains? (:imune target) attackType)
      target
      (let [attack (effectiveAttack attacker)
            finalAttack (if (contains? (:weak target) attackType)
                          (* 2 attack)
                          attack)
            killedUnits (int (/ finalAttack (:hp target)))
            newSize (- (:size target) killedUnits)
            newUnit (assoc target :size newSize)]
        newUnit))))

(defn executeRound
  [initUnits]
  (let [targetMap (target initUnits)
        atackOrder (atack_order initUnits)]
    (loop [[attacker & restAttackers] atackOrder
           currUnits initUnits]
      (if attacker
        (let [attackerUnit (get currUnits attacker)
              target (get targetMap attacker)]
          (if (and (isAlive? attackerUnit) target)
            (let [targetUnit (get currUnits target)
                  hurtUnit (hurtUnit attackerUnit targetUnit)
                  newUnits (assoc currUnits target hurtUnit)]
              ; (println "Attack: " attacker "->" target "All: " newUnits)
              (recur restAttackers newUnits))
            (recur restAttackers currUnits)))
        currUnits))))

(defn simulateBattle
  [initUnits]
  (loop [currUnits initUnits
         round 1]
    (let [liveUnits (filter isAlive? currUnits)
          armies (group-by :type liveUnits)]
      ;(println round (map #(vector (first %) (count (second %))) armies))
      (if (> (count armies) 1)
        (recur (executeRound currUnits) (inc round))
        (let [army (first armies)]
          {:winner (first army)
           :size (reduce + (map :size (second army)))})))))

; --------------------- part 2 -------------------------


(defn boostUnits
  [units boost type]
  (into [] (map #(if (= type (:type %))
                   (assoc % :attack (+ boost (:attack %)))
                   %) units)))

(defn findLowestBoost
  [units initStep]
  (let [adjustmentMap {"Inf" +, "Immune" -}]
    (loop [currentBoost initStep
           currentStep initStep
           lastWinner "Inf"]
      (let [boostedUnits (boostUnits units currentBoost "Immune")
            result (simulateBattle boostedUnits)
            thisWinner (:winner result)
            adjustment (get adjustmentMap thisWinner)]
        (println "Boost" currentBoost "step" currentStep "->" result)
        (if (and (= currentStep 1) (= lastWinner "Inf") (= thisWinner "Immune"))
          result
          (if (= thisWinner lastWinner)
            (let [nextBoost (adjustment currentBoost currentStep)]
              (recur nextBoost currentStep thisWinner))
            (let [newStep (int (Math/floor (/ currentStep 2)))
                  newBoost (adjustment currentBoost newStep)]
              (recur newBoost newStep thisWinner))))))))

(findLowestBoost test_units 100 )

