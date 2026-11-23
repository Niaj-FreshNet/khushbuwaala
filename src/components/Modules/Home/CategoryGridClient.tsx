import { CategoryCard } from "./CategoryCard"

type CategoryItem = {
    CategoryName: string
    CategoryImage: string
    CategoryLink: string
    description?: string
}

// Plain markup on purpose. This grid used to be animated in with a script library: it was sent to
// the browser invisible and only appeared once that script had loaded and run, which on a slow
// phone meant an empty gap where the categories should be.
export function CategoryGridClient({ categories }: { categories: CategoryItem[] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-0 sm:gap-0 lg:gap-0">
            {categories.map((category) => (
                <div key={category.CategoryName}>
                    <CategoryCard
                        CategoryName={category.CategoryName}
                        CategoryImage={category.CategoryImage}
                        CategoryLink={category.CategoryLink}
                        description={category.description ?? ""}
                    />
                </div>
            ))}
        </div>
    )
}
