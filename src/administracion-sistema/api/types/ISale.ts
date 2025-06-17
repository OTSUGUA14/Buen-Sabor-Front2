
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
    IDSale: number;
    denomination: string;
    startDate: string; 
    endDate: string; 
    startTime: string; 
    endTime: string; 
    saleDescription: string;
    salePrice: number;
    saleType: SaleType;
    inventoryImage: InventoryImage;
    manufacturedArticle: IProduct[]; //nose si es asi 
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