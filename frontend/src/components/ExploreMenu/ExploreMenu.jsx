// eslint-disable-next-line no-unused-vars
import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

// eslint-disable-next-line react/prop-types
const ExploreMenu = ({category, setCategory}) => {

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our Menu</h1>
      <p className='explore-menu-text'>Discover a world of flavors crafted with fresh ingredients and passion. From light and healthy salads to hearty comfort classics, every dish is prepared to delight your taste buds and satisfy your cravings</p>
      <div className="explore-menu-list">
        {menu_list.map((item, index)=>{
            return (

                <div 
                onClick={()=> setCategory(prev=>prev===item.menu_name?"All": item.menu_name)} 
                key={index} 
                className="explore-menu-list-item">
                    <img 
                    className={category===item.menu_name? "active" :""} 
                    src={item.menu_image} alt="" 
                    />
                    <p>{item.menu_name}</p>
                </div>
            )
        })}
      </div>
     <hr /> 
    </div>
  )
}

export default ExploreMenu;
