/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { toast } from "react-toastify";

const SideFilter = ({ price, category, ratings, setPrice, setCategory, setRatings }) => {
  const [localCategories, setLocalCategories] = useState([]);
  const [categoryToggle, setCategoryToggle] = useState(true);
  const [ratingsToggle, setRatingsToggle] = useState(true);
  const debounceTimeout = useRef(null);

  const priceHandler = (_, newPrice) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      const newVal = [
        Math.round(newPrice[0] / 1000) * 1000,
        Math.round(newPrice[1] / 1000) * 1000,
      ];
      setPrice(newVal);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/categories/categories`
        );
        if (res.status === 404) {
          toast.error("No Categories Found!", { toastId: "categoryNotFound" });
          
        }
        if (res.status === 200 || res.status === 201) {
          setLocalCategories(res.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (error.response?.status === 500) {
          toast.error("Something went wrong! Please try after sometime.", { toastId: "error" });
        }
      }
      
    };
    fetchCategories();
    
  }, []);

  const clearFilters = () => {
    setPrice([0, 200000]);
    setCategory("");
    // window.location.reload();
    setRatings(0);
  };

  return (
    <div className="hidden sm:flex flex-col w-1/5 px-1">
      <div className="flex flex-col bg-white rounded-sm shadow">
        <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
          <p className="text-lg font-medium">Filters</p>
          <span
            className="uppercase text-primaryBlue text-xs cursor-pointer font-medium"
            onClick={clearFilters}
          >
            clear all
          </span>
        </div>

        <div className="flex flex-col gap-2 py-3 text-sm overflow-hidden">
          {/* Price slider filter */}
          <div className="flex flex-col gap-2 border-b px-4">
            <span className="font-medium text-xs">PRICE</span>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              getAriaLabel={() => "Price range slider"}
              min={0}
              max={200000}
            />
            <div className="flex gap-3 items-center mb-2">
              <span className="flex-1 min-w-[70px] border px-4 py-1 rounded-sm text-gray-800 bg-gray-50">
                ₹{price[0].toLocaleString()}
              </span>
              <span className="font-medium text-gray-400">to</span>
              <span className="flex-1 min-w-[70px] border px-4 py-1 rounded-sm text-gray-800 bg-gray-50">
                ₹{price[1].toLocaleString()}
              </span>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-col border-b px-4">
            <div
              className="flex justify-between cursor-pointer py-2 pb-4 items-center"
              onClick={() => setCategoryToggle(!categoryToggle)}
            >
              <p className="font-medium text-xs uppercase">Category</p>
              {categoryToggle ? (
                <ExpandLessIcon sx={{ fontSize: "20px" }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: "20px" }} />
              )}
            </div>
            {categoryToggle && (
              <div className="flex flex-col pb-1">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="category-radio-buttons-group"
                    value={category} // Controlled value
                    onChange={(e) => setCategory(e.target.value)}
                    name="category-radio-buttons"
                  >
                    {localCategories.map((el) => (
                      <FormControlLabel
                        key={el._id}
                        value={el._id}
                        control={<Radio size="small" />}
                        label={<span className="text-sm">{el.name}</span>}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            )}
          </div>

          {/* Ratings filter */}
          <div className="flex flex-col border-b px-4 -mb-4">
            <div
              className="flex justify-between cursor-pointer py-2 pb-4 items-center"
              onClick={() => setRatingsToggle(!ratingsToggle)}
            >
              <p className="font-medium text-xs uppercase">Ratings</p>
              {ratingsToggle ? (
                <ExpandLessIcon sx={{ fontSize: "20px" }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: "20px" }} />
              )}
            </div>
            {ratingsToggle && (
              <div className="flex flex-col pb-1">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="ratings-radio-buttons-group"
                    value={ratings}
                    onChange={(e) => setRatings(e.target.value)}
                    name="ratings-radio-buttons"
                  >
                    {[4, 3, 2, 1].map((el, i) => (
                      <FormControlLabel
                        key={i}
                        value={el}
                        control={<Radio size="small" />}
                        label={
                          <span className="flex items-center text-sm">
                            {el}
                            <StarIcon sx={{ fontSize: "12px", mx: 0.5 }} />
                            &amp; above
                          </span>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideFilter;
