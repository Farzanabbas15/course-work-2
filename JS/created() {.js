created() {
    fetch("http://localhost:3000/collection/products")
      .then((response) => response.json())
      .then((data) => {
        this.products = data;
      });


  },

  watch: {
    search: function (val) {
      fetch("http://localhost:3000/collection/products/" + this.search)
        .then(
          function (response){
            response.json()
            console.log(response)
            this.products = response
          }
        )
    },
  },


  onSubmitCheckout: function () {
    if (
      this.order.name &&
      this.order.email &&
      this.order.address &&
      this.order.city &&
      this.order.zip &&
      this.order.state
    ) {
      this.checkout.push(this.order);
      this.order = {
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        state: "",
        method: "Home",
        gift: false,
      };
      this.finalorder = {
        name: this.checkout[0].name,
        email: this.checkout[0].email,
        address: this.checkout[0].address,
        city: this.checkout[0].city,
        zip: this.checkout[0].zip,
        state: this.checkout[0].state,
        method: this.checkout[0].method,
        gift: this.checkout[0].gift,
        products: this.cart,
        total: this.cart.reduce((acc, item) => acc + item.price, 0) + " AED",
      };
      console.log(this.finalorder);
      Swal.fire(
        "Order Submitted!",
        "Your order has been submitted!",
        "success"
      );
      // push finalorder to http://localhost:3000/collection/orders
      fetch("http://localhost:3000/collection/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.finalorder),
      })
        .then((response) => {
          console.log(response);
          return response.text();
        })
        .then((data) => {
          // resolve(data ? JSON.parse(data) : {})
          console.log("Success:", data);
          console.log(this.finalorder);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        
        const tempObj = {space: this.cart[0].space}
        fetch("http://localhost:3000/collection/products/" + this.cart[0]._id, {	
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tempObj),
        })
          .then((response) => {
            console.log(response);
            return response.text();
          })
          .then((data) => {
            console.log("Success:", data);
            console.log(this.finalorder);
          })

      this.cart = [];
      this.navigateTo("products");
    } else {
      Swal.fire(
        "Missing Fields?",
        "Please Make Sure all fields are filled out",
        "error"
      );
      this.page = "checkout";
    }
  },

  filteredProducts() {
    if (this.search) {
      let search = this.search.toLowerCase();
      return this.products.filter((product) => {
      return product.subject.toLowerCase().match(search) || product.location.toLowerCase().match(search);
      });
    }
  
    else {
      return this.products;
    }

  },