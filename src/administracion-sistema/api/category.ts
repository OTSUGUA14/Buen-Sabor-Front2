import type { ICategory } from './types/ICategory';

const BASE_URL = 'http://localhost:8080/category';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
    }
    return response.json();
}

export const categoryApi = {
    getAll: async (): Promise<ICategory[]> => {
        const res = await fetch(`${BASE_URL}/getAll`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<ICategory[]>(res);
    },

    getById: async (id: number): Promise<ICategory> => {
        const res = await fetch(`${BASE_URL}/getById/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        return handleResponse<ICategory>(res);
    },

    create: async (newItem: Omit<ICategory, 'id' | 'IDCategory'>): Promise<ICategory> => {
        const body = {
            name: newItem.name,
            isForSale: newItem.forSale,
        };
        const res = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(body),
        });
        return handleResponse<ICategory>(res);
    },

    update: async (updatedItem: ICategory): Promise<ICategory> => {
        const body = {
            name: updatedItem.name,
            isForSale: updatedItem.forSale,
        };
        const res = await fetch(`${BASE_URL}/update/${updatedItem.IDCategory}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            body: JSON.stringify(body),
        });
        return handleResponse<ICategory>(res);
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${BASE_URL}/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error ${res.status}: ${text}`);
        }
    },
};

// @RestController
// @CrossOrigin(origins = "*")
// @RequestMapping("/category")
// public class CategoryController {
//     @Autowired
//     private CategoryServiceImpl categoryServiceImpl;

//     @GetMapping("/getAll")
//     public List<Category> findAll(){
//         return categoryServiceImpl.getAllCategories();
//     }

//     @PostMapping("/add")
//     public ResponseEntity<Category> addCategory(@RequestBody CategoryDTO categoryDTO){
//         return ResponseEntity.status(HttpStatus.OK).body(categoryServiceImpl.addCategory(categoryDTO));
//     }

//     @PatchMapping("/update/{ID}")
//     public ResponseEntity<Category> updateCategory(@PathVariable("ID") Long ID, @RequestBody CategoryDTO categoryDTO){
//         return ResponseEntity.status(HttpStatus.OK).body(categoryServiceImpl.updateCategory(ID, categoryDTO));
//     }
// }
