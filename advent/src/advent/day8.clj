(ns advent.day8
  (:require [clojure.string :as s]
            [clojure.set :as set]))
(def raw_input (s/split (slurp "resources/input_day8") #"\s+"))
(def test_raw_input (s/split (slurp "resources/input_day8_test") #"\s+"))

(def input (map #(Integer/parseInt %) raw_input))
(def test_input (map #(Integer/parseInt %) test_raw_input))

(defn parseSubnodes
  [ix subnodeCount input currSubnodes]
  (if (> ix subnodeCount)
    {:input input :subnodes currSubnodes}
    (let [parseResult (parseNodes input)
          subnode (:node parseResult)
          newInput (:input parseResult)]
      (recur (inc ix) subnodeCount newInput (conj currSubnodes subnode)))))

(defn parseNodes
  [input]
  (let [subnodeCount (nth input 0)
        metadataCount (nth input 1)
        subnodeInput (drop 2 input)
        subnodeResult (parseSubnodes 1 subnodeCount subnodeInput [])
        metadataInput (:input subnodeResult)
        subnodes (:subnodes subnodeResult)
        metadata (take metadataCount metadataInput)
        restInput (drop metadataCount metadataInput)]
    {:input restInput :node {:subnodes subnodes :metadata metadata}}))

(def test_root (:node (parseNodes test_input)))
(def root (:node (parseNodes input)))

(defn sumMetadata
  [root currSum]
  (let [subnodeSums (map #(sumMetadata % 0) (:subnodes root))
        subnodeSum (reduce + subnodeSums)
        metadataSum (reduce + (:metadata root))]
    (+ currSum subnodeSum metadataSum)))

(def test_result (sumMetadata test_root 0))
(def result (sumMetadata root 0))
