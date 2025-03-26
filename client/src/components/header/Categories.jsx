import fishandmilk from "../../assets/images/Categories/fishandmilk.jpg";
import healthandbeauty from "../../assets/images/Categories/healthandbeauty.jpg";
import dress from "../../assets/images/Categories/dressandsomething.jpg";
import dairyandeggs from "../../assets/images/Categories/dairyandeggs.jpg";
import saucesandjams from "../../assets/images/Categories/saucesandjams.jpg";
import frozen from "../../assets/images/Categories/frozen.jpg";
import organic from "../../assets/images/Categories/organic.jpg";
import cannedfood from "../../assets/images/Categories/cannedfoods.jpg";
import coffeeandsnacks from "../../assets/images/Categories/coffeeandsnacks.jpg";
import { Link } from "react-router-dom";

const catNav = [
    {
        name: "Dress and something",
        icon: dress,
    },
    {
        name: "Fish and Milk",
        icon: fishandmilk,
    },
    {
        name: "Health and beauty",
        icon: healthandbeauty,
    },
 
    {
        name: "Dairy & Eggs",
        icon: dairyandeggs,
    },
    {
        name: "Sauces & Jams",
        icon: saucesandjams,
    },
    {
        name: "Frozen",
        icon: frozen,
    },
    {
        name: "Organic",
        icon: organic,
    },
    {
        name: "Canned Food",
        icon: cannedfood,
    },
    {
        name: "Coffee & Snacks",
        icon: coffeeandsnacks,
    },
];

const Categories = () => {
    return (
        <section className="hidden sm:block bg-white p-0 min-w-full px-12 py-10 shadow overflow-hidden">
            <div className="flex items-center justify-between group">
                {catNav.map((item, i) => (
                    <Link
                        to={`/products?category=${item.name}`}
                        className="flex flex-col gap-1 items-center p-2"
                        key={i}
                    >
                        <div className="h-16 w-16 ">
                            <img
                                draggable="false"
                                className="h-full categories-image w-full object-contain"
                                src={item.icon}
                                alt={item.name}
                            />
                        </div>
                        <span className="text-sm text-gray-800 font-medium group-hover:text-primary-blue">
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Categories;
