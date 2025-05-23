export default function Home() {
    return (
        <section id="home" className="flex items-stretch flex-col justify-end mt-16 ">
            <div className="flex flex-row items-center ">
                <div className="container text-left ml-8 w-3/5 pb-8">
                    <h1 className="font-lato font-extrabold text-[60px] leading-[1.6] text-gray-800 m-0">
                        <br />
                        Reinventamos
                        <br />
                        <span className="text-orange-500">LA RUEDA</span> para
                        <br />
                        darle <span className="text-orange-500">BUEN SABOR</span>
                    </h1>
                    <p className="font-righteous text-[23px] font-normal text-gray-500 text-left mt-4">
                        Un plato para cada antojo, un sabor para cada día
                    </p>
                    <br />
                </div>

                <div className="relative w-full">
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/pala-pizzera.png"
                        alt="pala"
                        className="absolute left-1/2 top-1/2 -translate-x-[40%] -translate-y-[43%] rotate-[35deg] max-w-[650px] max-h-[6500px] z-5"
                    />
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/pizza rueda2.webp"
                        alt="pizza"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[400px] max-h-[400px] z-6"
                    />
                </div>




            </div>
            <main className="px-8 lg:px-16 xl:px-32">
                <section
                    id="taste"
                    className="flex flex-row items-center justify-between mt-16 gap-8"
                >
                    <div className="w-1/2">
                        <h2 className="font-lato font-bold text-3xl text-gray-800 mb-4">
                            ¡Bienvenidos a El Buen Sabor!
                        </h2>
                        <p className="font-righteous text-lg text-gray-600">
                            Aquí creemos que la buena comida es más que solo un plato; es una experiencia que despierta los sentidos y llena el corazón. Nuestro menú está diseñado con ingredientes frescos y recetas cuidadosamente seleccionadas para llevarte en un viaje gastronómico único. Ya sea que busques un almuerzo rápido o una cena memorable, estamos aquí para deleitarte con cada bocado.
                        </p>
                    </div>
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/verdadero-sabor.png"
                        alt="chica comiendo hamburguesa"
                        className="w-96 object-contain"
                    />
                </section>

                <section
                    id="about-us"
                    className="flex flex-row items-center justify-between mt-16 gap-8"
                >
                    <img
                        src="/IMAGENES BUEN SABOR/MAIN/nosotros.png"
                        alt="nosotros"
                        className="w-96 h-96 object-cover rounded-full border-[10px] border-amber-500"
                    />

                    <div className="w-1/2 text-left">
                        <h2 className="font-lato font-bold text-3xl text-gray-800 mb-4">
                            SOBRE NOSOTROS
                        </h2>
                        <p className="font-righteous text-lg text-gray-600">
                            En Buen Sabor, nuestra misión es reinventar los platos clásicos con un toque único que haga cada bocado memorable. Combinamos ingredientes frescos y de alta calidad para crear una experiencia culinaria que se adapta a todos los gustos y antojos.<br /><br />
                            Nos dedicamos a crear una oferta culinaria diversa, que incluye desde pizzas artesanales hasta empanadas y hamburguesas, siempre asegurándonos de que encuentres algo delicioso que se ajuste a tus antojos. Cada día buscamos innovar y sorprender a nuestros clientes con sabores que reflejen nuestra dedicación y amor por la buena comida. ¡Te invitamos a descubrir el verdadero significado del buen sabor!
                        </p>
                    </div>
                </section>
            </main>


        </section>
    );
}
