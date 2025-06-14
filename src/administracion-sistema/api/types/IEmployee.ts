// src/administracion-sistema/api/types/IEmployee.ts

export type Role = 'ADMIN' | 'CASHIER' | 'CHEF' | 'DRIVER';
export type Shift = 'MORNING' | 'AFTERNOON' | 'NIGHT';

export interface IEmployee {
    id: number;
    name: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
    employeeRole: Role;
    salary: number;
    shift: Shift;
    username: string;
    password: string;
    domiciles: any[]; 
}


// public enum Role {
//     ADMIN, CASHIER, CHEF, DRIVER
// }

// public class Employee extends Person {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Enumerated(EnumType.STRING)
//     private Role employeeRole;

//     private Double salary;

//     @Enumerated(EnumType.STRING)
//     private Shift shift;

//     private String username;
//     private String password;

        
//     @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<Domicile> domiciles;
// }

