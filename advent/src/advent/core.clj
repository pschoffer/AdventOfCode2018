(ns advent.core
  (:gen-class)
  (:require [advent.day24 :as d]))




(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println
   (d/findLowestBoost d/units 50000)))



