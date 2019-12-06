(ns advent.day21
  (:require [clojure.string :as s]
            [clojure.set :as set]
            [advent.day19 :as base]
            [advent.day16 :as op]))


(def raw_input (s/split (slurp "resources/input_day21") #"\n"))

(def program_info (base/parseInput raw_input))

(defn doMaxig
  [reg1 addition]
  (let [filter 16777215
        sum (+ reg1 addition)]
    (bit-and (* 65899 (bit-and sum filter)) filter)))

(defn countStuff
  []
  (let [reg1_reset 8595037
        reg5_reset 65536]
    (loop [reg5 reg5_reset
           reg1 reg1_reset
           lookingfors (list)]
      (let [reg5_lowest_byte (bit-and reg5 255)
            reg1_after_maxic (doMaxig reg1 reg5_lowest_byte)]
        (if (> 256 reg5)
          (let [reseted_reg5 (bit-or reg1_after_maxic reg5_reset)
                reseted_reg5_lowest_byte (bit-and reseted_reg5 255)
                reseted_reg1_after_maxic (doMaxig reg1_reset reseted_reg5_lowest_byte)
                shifted_reseted_reg5 (bit-shift-right reseted_reg5 8)
                lookingfor reg1_after_maxic]
            (if (.contains lookingfors lookingfor)
              (first lookingfors)
              (recur shifted_reseted_reg5 reseted_reg1_after_maxic (conj lookingfors lookingfor))))
          (let [reg5_shifted (bit-shift-right reg5 8)]
            (recur reg5_shifted reg1_after_maxic lookingfors)))))))
; (time (countStuff))
