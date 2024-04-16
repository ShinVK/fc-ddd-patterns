import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    const order = await OrderModel.findOne({
      where: {
        id: entity.id,
      },
      include: ["items"],
    });

    order.items.forEach(async (orderItem) => {
      if (entity.items.find((item) => item.id == orderItem.id) == undefined) {
        await OrderItemModel.destroy({
          where: {
            id: orderItem.id,
          },
        });
      }
    });

    entity.items.forEach(async (orderItem) => {
      const orderItemModel = await OrderItemModel.findOne({
        where: {
          id: orderItem.id,
        },
      });

      if (!orderItemModel) {
        await OrderItemModel.create({
          id: orderItem.id,
          name: orderItem.name,
          order_id: entity.id,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
        });
      } else {
        await orderItemModel.update({
          name: orderItem.name,
          price: orderItem.price,
          product_id: orderItem.productId,
          quantity: orderItem.quantity,
        });
      }
    })


    await OrderModel.update({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      }))
    },
    {
      where: {
        id: entity.id
      }
    })  
  }

  async find(id: string): Promise<Order> {

      const orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: ["items"],
      })

      return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map((item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)))
      
   
  }

 
  async findAll(): Promise<Order[]> {
    var orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    return orderModels.map(
      (orderModel) =>
        new Order(
          orderModel.id,
          orderModel.customer_id,
          orderModel.items.map(
            (orderModelItem) =>
              new OrderItem(
                orderModelItem.id,
                orderModelItem.name,
                orderModelItem.price,
                orderModelItem.product_id,
                orderModelItem.quantity
              )
          )
        )
    );
  }
}
