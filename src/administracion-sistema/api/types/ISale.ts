
import type { IArticle } from './IArticle';
import { type IProduct } from './IProduct';

export enum SaleType {
    HAPPYHOUR = "HAPPYHOUR",
    SPRINGSALE = "SPRINGSALE",
    SUMMERSALE = "SUMMERSALE",
    WINTERSALE = "WINTERSALE",
    FALLSALE = "FALLSALE",
    CHRISTMASSALE = "CHRISTMASSALE"
}

export interface InventoryImage {
    IDInventoryImage: number;
    imageData: string; // Usualmente se maneja como base64 string en el frontend
}


export interface ISale {
    id:number;
    idsale: number;
    denomination: string;
    startDate: string; 
    endDate: string; 
    startTime: string; 
    endTime: string; 
    saleDescription: string;
    salePrice: number;
    saleType: SaleType;
    inventoryImage: InventoryImage;
    saleDetails: ISaleDetail[];
}
export interface ISaleDetail {
    IDSaleDetail: number;
    quantity: number;
    article?: IArticle | null; // Puede ser null
    manufacturedArticle?: IProduct | null; // Puede ser null
}


// public enum SaleType {
//     HAPPYHOUR, SPRINGSALE, SUMMERSALE, WINTERSALE, FALLSALE, CHRISTMASSALE
// }



// public class InventoryImage {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long IDInventoryImage;

//     @Lob
//     @Column(name = "image_data", columnDefinition="MEDIUMBLOB")
//     private byte[] imageData;
// }



// private Long IDSale;
    
//     private String denomination;
//     private LocalDate startDate;
//     private LocalDate endDate;
//     private LocalTime startTime;
//     private LocalTime endTime;
//     private String saleDescription;
//     private Double salePrice;

//     @Enumerated(EnumType.STRING)
//     private SaleType saleType;

//     @OneToOne(cascade = CascadeType.ALL)
//     @JoinColumn(name = "inventory_image_id", referencedColumnName = "IDInventoryImage")
//     private InventoryImage inventoryImage;

//     @OneToMany
//     @JsonManagedReference
//     private List<ManufacturedArticle> manufacturedArticle;