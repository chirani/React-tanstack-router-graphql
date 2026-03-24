import { createFileRoute } from '@tanstack/react-router'
import { useStoreData } from '../queries/categories'
import { useState } from 'react';

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const [categoryId, setCategoryId] = useState<string>("all")
    const { data: data2, isSuccess } = useStoreData(categoryId);

    if (isSuccess) {
        console.log(data2)
    }

    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
        </div>
    )
}
