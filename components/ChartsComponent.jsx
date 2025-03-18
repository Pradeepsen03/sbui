import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartsComponent = ({
  type,
  options,
  series,
  width,
  height,
  containerStyle,
  containerClassname,
  title,
  id,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  const isDataAvailable = series && Object.values(series).length > 0;

  useEffect(() => {
    if (isDataAvailable) {
      setTimeout(() => setIsLoading(false), 500); // Simulate slight delay for better UX
    } else {
      setIsLoading(true);
    }
  }, [isDataAvailable]);

  useEffect(() => {
    if (!id || !chartRef.current) return;

    const chartContainer = chartRef.current;
    const handleScroll = (event) => {
      console.log("Scrolling detected!", event.target.scrollLeft);
    };

    chartContainer.addEventListener("scroll", handleScroll);
    return () => chartContainer.removeEventListener("scroll", handleScroll);
  }, [id]);

  return (

    <>
     {
      isDataAvailable ? (   <div
        ref={chartRef}
        className={containerClassname}
        style={containerStyle}
        id={id}
      >
        <h5 className="text-center mb-3">{title}</h5>
        <Chart
          options={options || {}}
          type={type}
          series={series ? Object.values(series) : []}
          width={width}
          height={height}
        />
      </div>) : (<p className="text-center mt-5">Data not found</p>)
     }
    </>

 
  );
};

export default ChartsComponent;
