(ns advent.day9
  (:require [clojure.string :as s]
            [clojure.set :as set]))

(def input [476 71657])
(def test_input [9 25])

(defn insertMarble
  [currentPlaceMarbles preIx postIx newIx]
  (let [new {:id newIx :next postIx :prev preIx}
        oldPrev (get currentPlaceMarbles preIx)
        oldPost (get currentPlaceMarbles postIx)]
    (if (= preIx postIx)
      (let [newPrePost (assoc oldPrev :next newIx :prev newIx)]
        (assoc currentPlaceMarbles preIx newPrePost newIx new))
      (let [newPrev (assoc oldPrev :next newIx)
            newPost (assoc oldPost :prev newIx)]
        (do 
          ; (println [preIx postIx newIx])
          (assoc currentPlaceMarbles preIx newPrev postIx newPost newIx new)
          
          )))))
(defn removeMarble
  [currentPlaceMarbles removeIx player]
  (let [removeMarble (get currentPlaceMarbles removeIx)
        preIx (get removeMarble :prev)
        postIx (get removeMarble :next)
        preMarble (get currentPlaceMarbles preIx)
        postMarble (get currentPlaceMarbles postIx)
        newPreMarble (assoc preMarble :next postIx)
        newPostMarble (assoc postMarble :prev preIx)
        newRemoveMarble (assoc removeMarble :player player)
        ]
    ; [preIx postIx]
    (assoc currentPlaceMarbles preIx newPreMarble postIx newPostMarble removeIx newRemoveMarble)
    )
  )

(defn isGainingMarble
  [marble]
  (= (mod marble 23) 0))

(defn traverse
  ([table currIx steps op] (traverse table currIx 0 steps op))
  ([table currIx currStep totalSteps op]
   (if (>= currStep totalSteps)
     currIx
     (let [newIx (get-in table [currIx op])]
          (recur table newIx (inc currStep) totalSteps op)))))

(defn getNextPlayer
  [current playerCount]
  (if (= current playerCount) 1 (inc current))
  )

(defn placeMarbles
  ([marbleCount playerCount] 
   (let [marbleList (range 1 (inc marbleCount))
         initPlacedMarbles [{:id 0 :next nil :prev nil}]
         currMarbleIx 0
         currPlayer 1] 
     (placeMarbles marbleList initPlacedMarbles currMarbleIx currPlayer playerCount)))
  ([[newMarbleIx & restMarbles] placedMarbles currMarbleIx currPlayer playerCount]
   (let [nextPlayer (getNextPlayer currPlayer playerCount)]
     
     (if newMarbleIx
       
       (if (isGainingMarble newMarbleIx)
         (let [gainingMarble {:id newMarbleIx :player currPlayer}
               adjustedPlacedMarbles (conj placedMarbles gainingMarble)
               gainedMarbleIx (traverse adjustedPlacedMarbles currMarbleIx 7 :prev)
               newCurrentIx (get-in adjustedPlacedMarbles [gainedMarbleIx :next])
               newPlacedMarbles (removeMarble adjustedPlacedMarbles gainedMarbleIx currPlayer)
               ]
           (recur restMarbles newPlacedMarbles newCurrentIx nextPlayer playerCount)
           )


         (let [currMarble (get placedMarbles currMarbleIx)
               nextMarbleIx (:next currMarble)]
           (if nextMarbleIx
             (let [preInsertMarbleIx (:next currMarble)
                   postInsertMarbleIx (get-in placedMarbles [preInsertMarbleIx :next])
                   newPlacedMarbles (insertMarble placedMarbles preInsertMarbleIx postInsertMarbleIx newMarbleIx)]
               (recur restMarbles newPlacedMarbles newMarbleIx nextPlayer playerCount))
             (let [newPlacedMarbles (insertMarble placedMarbles currMarbleIx currMarbleIx newMarbleIx)]
               (recur restMarbles newPlacedMarbles newMarbleIx nextPlayer playerCount)))))
       placedMarbles)))))

(def test_placed (placeMarbles (second test_input) (first test_input)))
(def placed (placeMarbles (second input) (first input)))

(defn countPoints
  [placed]
  (let [gainedMarbles (filter #(:player %) placed)]
       (reduce (fn [result marble] 
                 (let [player (:player marble)
                       currScore (get result player 0)
                       newScore (+ currScore (:id marble))]
                      (assoc result player newScore)
                      )
                 ) {} gainedMarbles)))

(def test_points (countPoints test_placed))
(def points (countPoints placed))

(def test_max_points (apply max (map second test_points)))
(def max_points (apply max (map second points)))


; ----------------------- part 2 --------------------------

(def super_placed (placeMarbles (* 100 (second input)) (first input)))

(def super_points (countPoints super_placed))
(def super_max_points (apply max (map second super_points)))
