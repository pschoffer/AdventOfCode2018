(ns advent.day21
  (:require [clojure.string :as s]
            [clojure.set :as set]
            [advent.day19 :as base]
            [advent.day16 :as op]))


(def raw_input (s/split (slurp "resources/input_day21") #"\n"))

(def program_info (base/parseInput raw_input))


