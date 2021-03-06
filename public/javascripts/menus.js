// using context

$('.context.example .ui.sidebar')
  .sidebar({
    context: $('.context.example .bottom.segment')
  })
  .sidebar('attach events', '.context.example .menu .item');

$(document).ready(function() {
  //set up storage
  storageSetUp();
  $('.secondary.menu .item').tab({
    history: false
  });
  $('.tabular.menu .item').tab({
    history: false
  });
  var tableNumber = localStorage.getItem('activeTableNumber');
  var orderNumber = getOrderNumber();
  $('.invoice-order-number').text('Order #: ' + orderNumber[tableNumber]);
  loadInvoice(tableNumber);
});;

//update up order number
function updateOrderNumber(tableNumber) {
  var orderNumber = getOrderNumber();
  orderNumber[tableNumber]++;
  storeOrderNumber(orderNumber);
  $('.invoice-order-number').text('Order #: ' + orderNumber[tableNumber]);
}

//loads previous orders from this table
function loadInvoice(tableNumber) {
  console.log('Table #: ' + tableNumber);
  var tables = getTables();
  var orders = tables[tableNumber];
  if (orders != null) {
    for (i = 0; i < orders.length; i++) {
      var name = orders[i].name;
      var cost = orders[i].cost;
      var qty = orders[i].qty;
    }
    updateInvoice(orders);
  }
}

function updateCostTable(cost) {
  var costs = `<tr class="total">
            <td></td>
            <td>
              Sub Total: $${cost}
            </td>
          </tr>
          <tr class="total">
            <td></td>
            <td>
              Tax (9.0%): $${(cost*.09).toFixed(2)}
            </td>
          </tr>
          <tr class="total">
            <td></td>
            <td>
              Total: $${(cost + cost*.09).toFixed(2)}
            </td>
          </tr>`
  $("#costs-table").html(costs)
}

//adds order to the table
function updateInvoice(invoice) {
  var costTotal = 0;
  var orders = `<tr class="heading">
        <td>
          Item
        </td>

        <td>
          Price
        </td>
      </tr>`
  for (var index = 0; index < invoice.length; index++) {
    costTotal += (parseInt(invoice[index].cost) * invoice[index].qty);
    orders += `
        <tr class="item">
             <td>
              ${invoice[index].qty} ${invoice[index].name}
             </td>
             <td>
               $${invoice[index].qty * invoice[index].cost}
             </td>
           </tr>`
  }
  $("#orders-table").html(orders)
  updateCostTable(costTotal);
}

//adds a new order to the local storage
//calls updateInvoice
function addOrder(tag, tableNumber) {
  var name = tag.getAttribute("name");
  var cost = tag.getAttribute("cost");
  if (typeof(localStorage) !== "undefined") {
    var tables = getTables();
    if (tables[tableNumber] == null || tables[tableNumber].length == 0) {
      console.log('New table order added');
      tables[tableNumber] = [];
      updateOrderNumber(tableNumber);
    }
    var orders = tables[tableNumber];
    //increase quantity of item if there is already one
    for (i = 0; i < orders.length; i++) {
      if (name == orders[i].name) {
        orders[i].qty += 1;
        storeTables(tables);
        updateInvoice(orders)
        return;
      }
    }
    //didn't find one, add a new item
    var order = {
      "name": name,
      "cost": cost,
      "qty": 1
    };
    orders.push(order);
    storeTables(tables);
    updateInvoice(orders);
  }
}

function submitOrder() {
  //does nothing
  console.log(getTables());
}

//checkout order and pay
function checkoutOrder() {
  //need to show a payment prompt then call clearOrder()
  //defaults to calling clearOrder() right now
  clearOrder(localStorage.getItem("activeTableNumber"));
}

//clears order from table
function clearOrder(tableNumber) {
  var tables = getTables();
  tables[tableNumber] = [];
  storeTables(tables);
  loadInvoice(tableNumber);
}
