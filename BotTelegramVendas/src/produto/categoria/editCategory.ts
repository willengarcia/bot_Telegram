import { PrismaClient } from '@prisma/client';

interface DadosCategory {
    nameCategory: string;
    idCategory:number;
}

const prisma = new PrismaClient();

class EditCategory {
    async execute({
        nameCategory,
        idCategory
    }: DadosCategory) {
        try {
            // categoria existe
            const existCategory = await prisma.category.findFirst({
                where: {
                    name: nameCategory,
                }
            });
            
            // Possível erro de lógica.
            if (existCategory) {
                console.log('Categoria já existe')
                return {
                    idCategory: existCategory.id,
                    name:existCategory.name
                };
            }

            // Editar Categoria
            const editCategory = await prisma.category.update({
                where:{
                    id:idCategory,
                },
                data:{
                    name: nameCategory
                }
            });

            return {
                sucess:true,
                nameCategory:editCategory.name,
                idCategory:editCategory.id
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao editar Categoria:", error);
            return {
                'sucess':false,
                'error': error
            }
        }
    }
}

export { EditCategory };
