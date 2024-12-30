import { PrismaClient } from '@prisma/client';

interface DadosCategory {
    nameCategory: string;
    idCategory: number;
}

const prisma = new PrismaClient();

class DeleteCategory {
    async execute({
        nameCategory,
        idCategory
    }: DadosCategory) {
        try {
            // categoria existe
            const existCategory = await prisma.category.findFirst({
                where: {
                    id: idCategory,
                }
            });

            if (!existCategory) {
                console.log('Categoria não existe')
                return {
                    categoryExist: false
                };
            }

            // há produtos na subcategoria?
            const existItems = await prisma.category.findFirst({
                where: {
                    id: idCategory,
                    items:{
                        some:{}
                    }
                }
            });

            if (existItems) {
                console.log('Há produtos nessa Categoria')
                return {
                    sucess:false,
                    message: 'Há produtos nessa categoria!'
                };
            }


            // Cria ua nova categoria
            const deleteCategory = await prisma.category.delete({
                where:{
                    id:idCategory
                }
            })

            return {
                sucess:true,
                isDelete:true,
                message:'Categoria deletada com sucesso!'
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao deletar categoria:", error);
            return {
                'sucess':false,
                'error': error
            }
        }
    }
}

export { DeleteCategory };
