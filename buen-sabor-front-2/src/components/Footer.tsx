export default function Footer() {
    return (
        <footer className="bg-[#333333] flex flex-col py-[3%] pb-[4%]">
            <section className="flex flex-col items-center">
                <p className="flex justify-center font-bold text-white font-['Montserrat_Alternates'] text-lg">
                    Buen<span className="text-[#FFA101]">SABOR</span>
                </p>
                <div className="flex flex-row justify-evenly w-full flex-wrap gap-4 mt-4">
                    <div className="flex flex-row items-center text-white font-sans gap-2">
                        <img src="/IMAGENES BUEN SABOR/MAIN/telefono.png" alt="teléfono" className="w-[30px] h-[30px]" />
                        +54 9 261 123 4567
                    </div>
                    <div className="flex flex-row items-center text-white font-sans gap-2">
                        <img src="/IMAGENES BUEN SABOR/MAIN/ubi.png" alt="ubicación" className="w-[30px] h-[30px]" />
                        Cnel. Rodriguez 273, Ciudad, Mendoza
                    </div>
                    <div className="flex flex-row items-center text-white font-sans gap-2">
                        <img src="/IMAGENES BUEN SABOR/MAIN/relojFooter.png" alt="horario" className="w-[30px] h-[30px]" />
                        Lunes a Viernes, 9 AM - 9 PM
                    </div>
                </div>
            </section>
        </footer>
    );
}
