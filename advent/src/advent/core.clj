(ns advent.core
  (:gen-class)
  (:require [advent.day22 :as d]))




(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println
   (d/countRiskLevel d/input)))



