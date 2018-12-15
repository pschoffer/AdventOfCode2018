(ns advent.core
  (:gen-class)
  ; (:require ['advent.day1 :as 'day1])
  )

(require 'advent.day15)


; (day1/solve [1 2])

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println
   (advent.day15/simulateAndCount
    (:area advent.day15/input) (:units advent.day15/input))))

; (-main)
; (+ 1 2)


