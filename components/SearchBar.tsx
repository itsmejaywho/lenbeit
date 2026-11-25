"use client";

import { useState } from "react";
import { Dropdown } from "./ui/Dropdown";
import { landingPageContent } from "../lib/placeholder-data";

export function SearchBar() {
  const [activeCategory, setActiveCategory] = useState<string>(
    landingPageContent.listingsSection.categories[0],
  );
  const [selectedType, setSelectedType] = useState<string>(
    landingPageContent.search.typeOptions[0],
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    landingPageContent.search.locationOptions[0],
  );
  const { search, listingsSection } = landingPageContent;

  return (
    <div className="listing-controls">
      <div className="category-tabs" role="group" aria-label={landingPageContent.categoryLabel}>
        {listingsSection.categories.map((category) => (
          <button
            className={
              activeCategory === category
                ? "category-tab category-tab-active"
                : "category-tab"
            }
            type="button"
            aria-pressed={activeCategory === category}
            key={category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <form className="search-bar" onSubmit={(event) => event.preventDefault()}>
        <div className="search-field">
          <Dropdown
            variant="inline"
            label={search.type}
            aria-label={search.type}
            placeholder={search.type}
            value={selectedType}
            onChange={setSelectedType}
            items={search.typeOptions.map((option) => ({ id: option, label: option }))}
          />
        </div>
        <div className="search-field">
          <Dropdown
            variant="inline"
            label={search.location}
            aria-label={search.location}
            placeholder={search.location}
            value={selectedLocation}
            onChange={setSelectedLocation}
            items={search.locationOptions.map((option) => ({ id: option, label: option }))}
          />
        </div>
        <div className="search-field search-price">
          <div className="search-price-content">
            <span className="search-field-label">{search.price}</span>
            <p>{search.priceRange}</p>
          </div>
        </div>
        <button className="button button-dark search-submit" type="submit">
          {search.button}
        </button>
      </form>
    </div>
  );
}
