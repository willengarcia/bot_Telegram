import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface DadosItens{
    idItem:number;
}
class FindAllInfoFromItem {
    async execute({idItem}:DadosItens) {
        try {
            const existItem = await prisma.item.findFirst()
            if(!existItem){
                return {
                    success:false,
                    message:'Não há nenhuma informação para listar!'
                }
            }

            // Pesquisa todas as Subcategorias
            const findAllItemFromItem = await prisma.item.findFirst({
                where:{
                    id:idItem
                },
                select:{
                    id:true,
                    name:true,
                    imagePath:true,
                    link:true,
                    price:true,
                    sales:true,
                    category:{
                        select:{
                            name:true
                        }
                    },
                    subCategory:{
                        select:{
                            name:true,
                        }
                    }
                }
            })

            return {
                sucess: true,
                find: findAllItemFromItem
            };

        } catch (error) {
            // Tratamento de erro
            console.error("Erro ao pesquisar subcategorias:", error);
            return {
                'sucess':false,
                'error': error.message
            }
        }
    }
}

export { FindAllInfoFromItem };
