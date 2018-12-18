(ns advent.core
  (:gen-class)
  ; (:require ['advent.day1 :as 'day1])
  )

(require 'advent.day18)


; (day1/solve [1 2])

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println
   (advent.day18/multiTransformAndSum advent.day18/area 50 10)))

; (-main)
; (+ 1 2)


